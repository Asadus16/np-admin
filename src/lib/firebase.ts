import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

export type { ConfirmationResult };

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase lazily (client-side only)
let app: FirebaseApp | null = null;
let auth: Auth | null = null;

function getFirebaseApp(): FirebaseApp {
  if (typeof window === 'undefined') {
    throw new Error('Firebase can only be initialized in the browser');
  }
  if (!app) {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

// Recaptcha verifier instance
let recaptchaVerifier: RecaptchaVerifier | null = null;

export function getRecaptchaVerifier(): RecaptchaVerifier {
  // Ensure we're in the browser
  if (typeof window === 'undefined') {
    throw new Error('reCAPTCHA can only be initialized in the browser');
  }

  // Clear existing verifier and container before creating a new one
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch {
      // Ignore errors when clearing - verifier might already be cleared
    }
    recaptchaVerifier = null;
  }

  // Get and clear the container element
  const container = document.getElementById('recaptcha-container');
  if (!container) {
    throw new Error('reCAPTCHA container element not found. Make sure <div id="recaptcha-container"></div> exists in the DOM');
  }

  // Remove all child nodes to ensure clean state
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Create new verifier
  recaptchaVerifier = new RecaptchaVerifier(getFirebaseAuth(), 'recaptcha-container', {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved, allow sendSMS.
    },
    'expired-callback': () => {
      // Response expired. Ask user to solve reCAPTCHA again.
      console.error('reCAPTCHA expired');
    },
  });

  return recaptchaVerifier;
}

export function clearRecaptchaVerifier(): void {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch {
      // Ignore errors when clearing - verifier might already be cleared
    }
    recaptchaVerifier = null;
  }

  // Clear the container element content
  if (typeof window !== 'undefined') {
    const container = document.getElementById('recaptcha-container');
    if (container) {
      // Remove all child nodes to ensure clean state
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
  }
}

// Phone authentication functions
export async function sendOTP(phoneNumber: string): Promise<ConfirmationResult> {
  const verifier = getRecaptchaVerifier();
  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
  return signInWithPhoneNumber(getFirebaseAuth(), formattedPhone, verifier);
}

export async function verifyOTP(confirmationResult: ConfirmationResult, code: string) {
  return confirmationResult.confirm(code);
}

export { getFirebaseApp as app };


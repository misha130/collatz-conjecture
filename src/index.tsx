/* @refresh reload */
import { render } from "solid-js/web";
import { inject } from "@vercel/analytics";
import "./styles/global.css";
import App from "./App.tsx";

// Generic (framework-agnostic) entry point — this is a Vite/SolidJS app, not
// Next.js, so the React-specific @vercel/analytics/react import doesn't apply.
// No-ops harmlessly when the site isn't served from Vercel.
inject();

const root = document.getElementById("root");

render(() => <App />, root!);

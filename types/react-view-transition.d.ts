import "react";

/**
 * `<ViewTransition>` ships in the React canary that Next bundles for the App
 * Router, but `@types/react` tracks the stable release and does not declare it
 * yet. This augments the module so the component typechecks.
 *
 * Delete this file once @types/react exports ViewTransition itself.
 */
declare module "react" {
  interface ViewTransitionProps {
    children?: React.ReactNode;
    /** Shared identity — the same name on two routes morphs between them. */
    name?: string;
    /** Class applied to the transition, for ::view-transition-* targeting. */
    share?: string;
    enter?: string;
    exit?: string;
    update?: string;
    default?: string;
  }

  export const ViewTransition: React.FC<ViewTransitionProps>;
}

import React from "react";

// render this instead of <FallbackComponent /> while developing to test suspense state
const SuspenseTrigger = () => {
  throw new Promise(() => {});
};

export default function LazyLoad({
  load,
  fallback: FallbackComponent,
  ...props
}) {
  const [Component, setComponent] = React.useState(() => FallbackComponent);

  React.useEffect(() => {
    setComponent(() => React.lazy(load));
  }, []);

  return (
    <React.Suspense fallback={<FallbackComponent />}>
      <Component {...props} />
    </React.Suspense>
  );
}

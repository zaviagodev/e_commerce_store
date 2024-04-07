export const StepMaintainer = ({
  useStateHook,
  children,
}: {
  useStateHook: any;
  children: any;
}) => {
  const { current, setTotalSteps } = useStateHook();
  setTotalSteps(Array.isArray(children) ? children.length : 1);
  return Array.isArray(children) ? children[current] : children;
};

export default StepMaintainer;

type SvgContainerProps = {
  children: React.ReactNode;
  viewBox?: string;
};

function SvgContainer({ children, viewBox }: SvgContainerProps) {
  return (
    <svg width="100%" height="100%" viewBox={viewBox}>
      {children}
    </svg>
  );
}

export default SvgContainer;

export const LoadingIndicator = () => {
  return (
    <div className="fixed inset-0 z-0 bg-transparent">
      <div className="absolute bottom-0 right-0">
        <svg
          className="z-20 h-14 w-16"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          enableBackground="new 0 0 0 0"
          xmlSpace="preserve"
        >
          <circle fill="#253a83" stroke="none" cx={6} cy={50} r={6}>
            <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1" />
          </circle>
          <circle fill="#253a83" stroke="none" cx={26} cy={50} r={6}>
            <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
          </circle>
          <circle fill="#253a83" stroke="none" cx={46} cy={50} r={6}>
            <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3" />
          </circle>
        </svg>
      </div>
    </div>
  )
}

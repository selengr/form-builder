import type { SVGProps } from "react";

export function UiwPlusSquare(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        fill="currentColor"
        d="M18.182 0C19.186 0 20 .814 20 1.818v16.364A1.82 1.82 0 0 1 18.182 20H1.818A1.82 1.82 0 0 1 0 18.182V1.818C0 .814.814 0 1.818 0zm-7.884 4.91a.68.68 0 0 0-.682.682L9.615 9.3H5.909a.68.68 0 0 0-.674.581l-.008.1c0 .378.306.683.682.683l3.706-.001v3.707c0 .343.253.626.582.675l.1.007a.68.68 0 0 0 .682-.682v-3.707h3.707a.68.68 0 0 0 .675-.58l.007-.101a.68.68 0 0 0-.682-.682H10.98V5.592a.68.68 0 0 0-.58-.674Z"
      ></path>
    </svg>
  );
}

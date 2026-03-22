import { useTheme } from "next-themes";

export const Logo = (
  props: React.SVGProps<SVGSVGElement> & {
    className?: string;
    size?: "sm" | "default" | "lg" | number;
  }
) => {
  const { className, size = "default", ...rest } = props;
  const sizeResolved =
    typeof size === "number" ? size : size === "sm" ? 32 : size === "default" ? 44 : 56;

  const { theme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark" || theme === "dark";

  const color = isDark ? "var(--primary)" : "var(--primary)";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 160"
      width={sizeResolved}
      height={sizeResolved}
      {...rest}
    >
      <defs>
        <mask id="moonMask">
          <rect width="160" height="160" fill="white" />
          <circle cx="96" cy="80" r="32" fill="black" />
        </mask>
      </defs>

      {/* Rect with 10px padding */}
      <rect
        x="10"
        y="10"
        width="140"
        height="140"
        rx="28"
        fill="none"
        stroke={color}
        strokeWidth="10"
      />

      <circle cx="80" cy="80" r="45" fill={color} mask="url(#moonMask)" />

      <polygon
        points="
          110,62
          114,74
          128,74
          118,82
          122,96
          110,88
          98,96
          102,82
          92,74
          106,74
        "
        fill={color}
      />
    </svg>
  );
};

import { useState, useRef, useEffect, type ReactNode } from "react";
import { Link } from "react-router";

interface DropdownItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface DropdownProps {
  items: DropdownItem[];
  trigger: ReactNode;
}

export default function MenuDropdown({ items, trigger }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-gray-700 backdrop-blur-sm border border-white/10 shadow-xl z-50">
          <div className="flex flex-col py-2">
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-2 px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors rounded-lg"
                onClick={() => setOpen(false)}
              >
                {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

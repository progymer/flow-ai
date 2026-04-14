import { AudioWaveform } from "lucide-react";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/workflow" className="flex items-center gap-1">
      <div
        className="size-7 rounded-sm
       flex items-center justify-center text-lg
      "
      >
        <span>
            <AudioWaveform className="text-primary/80 size-5" />
        </span>
      </div>
      <div className="flex items-center">
        <span className="font-black text-primary/80 text-lg">Flow</span>
        <span
          className="font-black text-foreground
        text-lg"
        >
          .ai
        </span>
      </div>
    </Link>
  );
};

export default Logo;

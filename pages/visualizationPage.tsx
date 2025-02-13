import { pretendard } from "@/lib/fonts";
import Visualization from "@/components/Visualization";

export default function VisualizationPage() {
    return (
      <div className={`${pretendard.variable} h-screen bg-[#d2d0cc]`}>
        <div className="h-full">
            <Visualization/>
        </div>
      </div>
    );
  }
  
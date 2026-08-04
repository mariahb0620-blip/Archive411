import type { Showroom } from "@/app/types/domain";
import { showroomAppointmentLabel } from "@/app/services/showroom.service";

interface ShowroomNoticeProps {
  showroom: Showroom;
  compact?: boolean;
}

export default function ShowroomNotice({ showroom, compact }: ShowroomNoticeProps) {
  const label = showroomAppointmentLabel(showroom);

  return (
    <div
      className={`border border-accent/30 bg-accent/5 ${compact ? "p-3" : "p-5"}`}
      role="note"
    >
      <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
        {showroom.retailerClassification}
      </p>
      {!compact && (
        <p className="mt-2 text-sm text-ivory">{showroom.name}</p>
      )}
      <p className={`${compact ? "mt-1" : "mt-3"} text-xs leading-relaxed text-muted`}>
        {label}
      </p>
      {showroom.reserveBeforeAppointment && (
        <p className="mt-2 text-xs text-smoke">
          You can reserve pieces before your appointment via your fitting list.
        </p>
      )}
    </div>
  );
}

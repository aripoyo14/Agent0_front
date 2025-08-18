interface ProfileHeaderProps {
  name: string;
  affiliation?: string | null; // 氏名下に所属
  evaluationAverage?: number | null; // 平均評価
  email?: string;
  phone?: string;
}

export function ProfileHeader({ name, affiliation, evaluationAverage, email, phone }: ProfileHeaderProps) {
  return (
    <div className="h-full flex items-center">
      <div className="max-w-full flex items-start justify-between w-full gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-sm lg:text-base font-bold text-white">{name}</h1>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/20 text-white text-[10px] lg:text-xs font-bold">
              {`評価: ${evaluationAverage != null ? `${evaluationAverage}/5` : '-/5'}`}
            </span>
          </div>
          {affiliation && (
            <p className="text-[10px] lg:text-xs text-white/90 mb-1 line-clamp-1">{affiliation}</p>
          )}
        </div>
        <div className="flex items-start gap-4 flex-shrink-0">
          <div className="flex flex-col items-start gap-1">
            {email && (
              <div className="flex items-center gap-1 text-white">
                <span className="material-symbols-outlined text-xs">mail</span>
                <span className="text-[10px] lg:text-xs">{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-1 text-white">
                <span className="material-symbols-outlined text-xs">call</span>
                <span className="text-[10px] lg:text-xs">{phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

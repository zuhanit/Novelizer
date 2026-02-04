interface TitleProps {
  title: string;
}

export function Title({ title }: TitleProps) {
  return (
    <section>
      <h1>{title}</h1>
    </section>
  );
}

export interface PathSegment {
  name: string;
  path: string;
}

interface TitlePathProps {
  segments: PathSegment[];
}

/**
 * A Breadcrumb path component for the header.
 *
 * Each segment of the path is clickable and navigates to the corresponding section.
 */
export function TitlePath({ segments }: TitlePathProps) {
  return (
    <nav aria-label="breadcrumb">
      {segments.map((segment, index) => (
        <span key={index}>
          <SegmentLink segment={segment} />
          {index < segments.length - 1 && " / "}
        </span>
      ))}
    </nav>
  );
}

function SegmentLink({ segment }: { segment: PathSegment }) {
  return (
    <a href={segment.path} className="font-title-regular">
      {segment.name}
    </a>
  );
}

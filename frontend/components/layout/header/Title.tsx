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

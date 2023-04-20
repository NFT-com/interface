export default function YouTubeEmbed({ embedId }) {
  return (
    <div className='relative h-0 pb-[56.25%] pt-6'>
      <iframe
        width='100%'
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder='0'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
        title='Embedded YouTube Video'
        className='absolute left-0 top-0 block h-full w-full'
      />
    </div>
  );
}

export function useCheckFileType(src: string) {
  const badFileTypes = ['webp', 'svg', 'gif', 'mp4', 'png'];
  src?.split('.');
  const ext = src?.split('.').pop();
  if(badFileTypes.indexOf(ext) >= 0){
    return src;
  } else {
    return src + '?width=600';
  }
}
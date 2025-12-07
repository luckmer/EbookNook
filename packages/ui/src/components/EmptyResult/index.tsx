import { Typography } from '@components/Typography'

const EmptyResult = () => {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-32 max-w-[600px] mx-auto px-12">
      <Typography text="h1" class="text-[48px]! leading-[50px]">
        No results
      </Typography>
      <Typography text="body" center class="leading-[24px]">
        We couldn't find anything matching your search. Try adjusting your filters or searching with
        different keywords.
      </Typography>
    </div>
  )
}

export default EmptyResult

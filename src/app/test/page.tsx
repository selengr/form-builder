
export default function Home() {
  return(
    <Button onClick={() => setOpen(true)}>
  نمایش امرسالت
</Button>

<MresalatDialog
  open={open}
  onClose={() => setOpen(false)}
/>

  )
}

export function Footer() {
  return (
    <footer className="bg-secondary mx-auto mt-10 items-center px-40 pt-8 pb-3">
      <div className="grid grid-cols-3">
        <div>
          <p className="text-lg">Contact Info</p>
          <p className="text-4xl font-bold">
            We are always happy to assist you
          </p>
        </div>
        <div className="ml-30">
          <p className="text-base font-semibold">Email Address</p>
          <p className="text-base font-medium">Ineedhelp@info.com</p>
          <p>Assistance hours:</p>
          <p>Monday - Friday: 6 am to 8 pm EST</p>
        </div>
        <div className="ml-30">
          <p className="text-base font-semibold">Number</p>
          <p className="text-base font-medium">{'(61) 9 9999-9999'}</p>
          <p>Assistance hours:</p>
          <p>Monday - Friday: 6 am to 8 pm EST</p>
        </div>
      </div>
      <p className="mt-10 text-center text-base">&copy; 2025 MCI Proj NL1c</p>
    </footer>
  )
}

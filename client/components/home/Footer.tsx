export function Footer() {
  return (
    <footer className="bg-secondary mx-auto mt-8 md:mt-12">
      {/* Main Content */}
      <div className="px-4 md:px-20 lg:px-40 pt-8 md:pt-12 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Main Information */}
          <div className="text-center lg:text-left">
            <h3 className="text-lg md:text-xl font-bold mb-3">Contact Info</h3>
            <p className="text-2xl md:text-3xl font-bold text-primary mb-6">
              We are always happy to assist you
            </p>
            <div className="text-sm md:text-base text-muted-foreground">
              <p className="mb-1">Assistance hours:</p>
              <p className="font-medium">Monday - Friday: 6 am to 8 pm ACST</p>
            </div>
          </div>
          
          {/* Right: Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center lg:text-left">
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-2">Email</h4>
              <a 
                href="mailto:Ineedhelp@info.com" 
                className="text-sm md:text-base text-primary hover:text-primary/80 font-medium transition-colors"
              >
                customersupport@lumiere.com
              </a>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-2">Phone</h4>
              <a 
                href="tel:+61999999999" 
                className="text-sm md:text-base text-primary hover:text-primary/80 font-medium transition-colors"
              >
                +61 1800 123 456
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Copyright Area */}
      <div className="border-t border-border/50 px-4 md:px-20 lg:px-40 py-4">
        <p className="text-center text-xs md:text-sm text-muted-foreground">
          &copy; 2025 MCI Proj NL1c. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

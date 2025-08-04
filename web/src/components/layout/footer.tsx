export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex h-14 items-center justify-between">
        <div className="text-sm text-muted-foreground">
          © 2025 FamilyCFO. All rights reserved.
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <a href="/privacy" className="hover:text-foreground">
            Privacy
          </a>
          <a href="/terms" className="hover:text-foreground">
            Terms
          </a>
          <a href="/support" className="hover:text-foreground">
            Support
          </a>
        </div>
      </div>
    </footer>
  )
} 
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-8 py-4">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © 2024 EduManage Student Information System. v2.4.0
        </p>
        <div className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms of Service
          </Link>
          <Link
            href="/help"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Help Desk
          </Link>
        </div>
      </div>
    </footer>
  )
}

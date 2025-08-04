import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"

export default function Home() {
  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                FamilyCFO
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Luxury-grade, CFO-level personal finance platform with month-by-month forecasting, 
              liquidity intelligence, and scenario planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="group rounded-lg border p-6 transition-colors hover:border-foreground/20 hover:bg-muted/50">
              <h3 className="text-lg font-semibold mb-2">Features</h3>
              <p className="text-sm text-muted-foreground">
                Month-by-month forecasting, liquidity intelligence, scenario planning
              </p>
            </div>

            <div className="group rounded-lg border p-6 transition-colors hover:border-foreground/20 hover:bg-muted/50">
              <h3 className="text-lg font-semibold mb-2">Technology</h3>
              <p className="text-sm text-muted-foreground">
                Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
              </p>
            </div>

            <div className="group rounded-lg border p-6 transition-colors hover:border-foreground/20 hover:bg-muted/50">
              <h3 className="text-lg font-semibold mb-2">Design</h3>
              <p className="text-sm text-muted-foreground">
                Dark mode support, responsive design, luxury UI
              </p>
            </div>

            <div className="group rounded-lg border p-6 transition-colors hover:border-foreground/20 hover:bg-muted/50">
              <h3 className="text-lg font-semibold mb-2">Get Started</h3>
              <Button className="w-full">
                Explore Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

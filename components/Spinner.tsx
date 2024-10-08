import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Loader } from "lucide-react";

const SpinnerVariants = cva("text-muted-background animated-spin", {
    variants: {
        size: {
            default: 'h-4 w-4',
            sm: "h-2 w-2",
            lg: 'h-6 w-6',
            icon: 'w-10 h-10',
        }
    }, defaultVariants: {
        size: "default",
    }
});

interface SpinnerProps extends VariantProps<typeof SpinnerVariants> {

}
export const Spinner = ({size,}: SpinnerProps) => {
    return (
        <Loader className={cn(SpinnerVariants({size}))} />
    )
}
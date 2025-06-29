import { Button } from "../ui/button";
import { Home, LinkIcon, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PaymentLinkCreate from "../payment-create-modal";
import { DialogTrigger } from "@radix-ui/react-dialog";
function Footer() {
  return (
    <footer className="w-full flex justify-center z-50 ">
      <Dialog>
        <div className="w-fit mx-auto flex items-center justify-between fixed bottom-5 left-0 right-0 mt-4 z-50 gap-2 bg-white neumorphic-border">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-xl bg-primary text-black hover:bg-green-600"
          >
            <Home className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-xl hover:bg-gray-100"
          >
            <LinkIcon className="h-5 w-5" />
          </Button>
          <DialogTrigger asChild>
            <Button className="h-12 px-4 bg-black hover:bg-black/80 text-white rounded-xl font-bold flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Link
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className="neumorphic-border p-5">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-gray-900 p-0">
              Create Payment Link
            </DialogTitle>
            <DialogDescription className="text-gray-600 font-medium p-0">
              Customize your payment link details
            </DialogDescription>
          </DialogHeader>
          <PaymentLinkCreate />
        </DialogContent>
      </Dialog>
    </footer>
  );
}

export default Footer;

{
  /* Bottom Navigation */
}

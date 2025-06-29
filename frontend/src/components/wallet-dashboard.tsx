"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Smile,
  Copy,
  ExternalLink,
  Heart,
  Home,
  LinkIcon,
  Plus,
  ActivityIcon,
  Pen,
  Banknote,
  BanknoteIcon,
  DollarSign,
  User,
  Loader2,
} from "lucide-react";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertDialogContent } from "./ui/alert-dialog";
import PaymentLinkModal from "./payment-edit-modal";
import Footer from "./elements/footer";
import useTokenOperations from "@/hooks/use-token-canister-calls";
import { formatVPTAmount } from "@/utils/vaultPayUtils";
import useAliasOperations from "@/hooks/use-alias-operation";
import { AliasEntry } from "@declarations/alias_registry/alias_registry.did";
import {
  AnalyticsEvent,
  EventType,
} from "@declarations/analytics_logger/analytics_logger.did";
import { useAuth } from "@/hooks/use-auth-client";
import useCanisterCalls from "@/hooks/use-canister-calls";
import toast from "react-hot-toast";

export default function CryptoDashboard() {
  const [balanceLoading, setBalanceLoading] = useState<boolean>(true);
  const [linksLoading, setLinksLoading] = useState<boolean>(true);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);
  const [activeReceiveTab, setActiveReceiveTab] = useState("link");
  const [activeActivityTab, setActiveActivityTab] = useState("all");
  const [balance, setBalance] = useState<bigint | null>();
  const [links, setLinks] = useState<(AliasEntry | null)[]>();
  const [selectedLinkForEdit, setSelectedLinkForEdit] =
    useState<AliasEntry | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<AnalyticsEvent[]>([]);

  const { getUserBalance } = useTokenOperations();
  const { getAliasInfo, getUserAliases, updateAlias } = useAliasOperations();
  const { identity, principal } = useAuth();
  const { analytics } = useCanisterCalls({ identity });
  console.log(principal?.toString());
  const handleCopyLink = (linkData: AliasEntry | null) => {
    navigator.clipboard.writeText(
      `${window.location.host}/send/${linkData?.alias}`
    );
    toast.success("Link copied to clipboard!");
  };

  const handleOpenLink = (linkData: AliasEntry | null) => {
    window.open(`/send/${linkData?.alias}`);
  };

  const handleEditLink = (linkData: AliasEntry | null) => {
    setSelectedLinkForEdit(linkData);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setBalanceLoading(true);
        const balance = await getUserBalance();
        setBalance(balance);
      } catch (error) {
        console.error("Error fetching user balance:", error);
      } finally {
        setBalanceLoading(false);
      }
    };

    const fetchUserAliases = async () => {
      try {
        setLinksLoading(true);
        const aliases = await getUserAliases();
        console.log("User aliases:", aliases);
        if (aliases && aliases.length > 0) {
          const aliasInfoPromises = aliases.map((alias) => getAliasInfo(alias));
          const aliasInfos = await Promise.all(aliasInfoPromises);
          setLinks(aliasInfos);
        } else {
          console.log("No aliases found for user.");
        }
      } catch (error) {
        console.error("Error fetching user aliases:", error);
      } finally {
        setLinksLoading(false);
      }
    };

    const fetchHistory = async () => {
      try {
        setHistoryLoading(true);
        if (principal) {
          // Fetch events by principal with a reasonable limit
          const userEvents = await analytics.getEventsByPrincipal(
            principal,
            50n
          );
          if (userEvents) {
            setEvents(userEvents);
          }
        }
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
    fetchUserAliases();
    fetchBalance();
  }, []);

  // Filter events based on active tab
  const filterEvents = (events: AnalyticsEvent[], filter: string) => {
    switch (filter) {
      case "incoming":
        return events.filter(
          (event) =>
            "Payment" in event.event_type ||
            "AliasRegistration" in event.event_type
        );
      case "outgoing":
        return events.filter((event) => "Transfer" in event.event_type);
      default:
        return events;
    }
  };

  // Update filtered events when activeActivityTab or events change
  useEffect(() => {
    setFilteredEvents(filterEvents(events, activeActivityTab));
  }, [events, activeActivityTab]);

  // Format event type for display
  const formatEventType = (eventType: EventType) => {
    if ("Payment" in eventType) return "Payment Received";
    if ("Transfer" in eventType) return "Payment Sent";
    if ("AliasRegistration" in eventType) return "Alias Created";
    if ("AliasUpdate" in eventType) return "Alias Updated";
    return "Unknown";
  };

  // Format timestamp
  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert from nanoseconds
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-background pt-10 pb-4">
      {/* Top Bar */}

      {/* Main Content */}
      <main className="max-w-3xl mx-auto space-y-6">
        {/*  Balances Card */}
        <Card className="">
          {/* Glowing effect */}

          <div className="relative z-10 neumorphic-border bg-primary p-6">
            <h2 className="text-xl font-black mb-4"> Balances</h2>

            <div className="text-center py-8">
              {balanceLoading ? (
                <div className="flex flex-col items-center space-y-4 py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-black " />
                  <p className="text-black font-black">
                    Loading your balance...
                  </p>
                </div>
              ) : balance == 0n ? (
                <div className="">
                  <div className="text-4xl font-black mb-2">$0.00 TPY</div>
                  <p className="text-black/60 mb-6">
                    Immutable payments received through TEPAY
                  </p>

                  <div className="w-16 h-16 bg-green-200/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>

                  <p className="font-bold text-lg mb-2">No balances yet</p>
                  <p className="text-sm text-black/60 max-w-md mx-auto">
                    This shows only secure payment balances received through
                    TEPAY, not your regular wallet funds.
                  </p>
                </div>
              ) : (
                <div className="text-4xl font-black mb-2">
                  ${formatVPTAmount(balance as bigint)} TPY
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Receive Card */}
        <Card className="border-4 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <h2 className="text-xl font-black mb-4">Receive</h2>

          <Tabs
            value={activeReceiveTab}
            onValueChange={setActiveReceiveTab}
            className="mb-6"
          >
            <TabsList className="bg-gray-100 border-2 border-black rounded-xl p-1">
              <TabsTrigger
                value="link"
                className="rounded-lg data-[state=active]:bg-black data-[state=active]:text-white font-bold"
              >
                Link
              </TabsTrigger>
              <TabsTrigger
                value="quick"
                className="rounded-lg data-[state=active]:bg-black data-[state=active]:text-white font-bold"
              >
                Quick
              </TabsTrigger>
            </TabsList>

            <TabsContent value="link" className="space-y-4">
              <Dialog>
                <div className="flex flex-col gap-2">
                  {linksLoading ? (
                    <div className="flex flex-col items-center space-y-4 py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-black " />
                      <p className="text-black font-black">
                        Loading your payment links...
                      </p>
                    </div>
                  ) : links && links.length > 0 ? (
                    links.map((value, i) => (
                      <div key={i} className="flex-1 relative">
                        <Input
                          value={`${window.location.host}/send/${value?.alias}`}
                          readOnly
                          className="border-2 border-black rounded-xl font-bold pr-20"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditLink(value)}
                            >
                              <Pen className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCopyLink(value)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenLink(value)}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="w-full text-center">
                      <h1 className="text-2xl font-black ">
                        Create Your First Link
                      </h1>
                      <p className="text-gray-600 mb-6">
                        Set up a personalized Tepay payment link
                      </p>

                      <Button
                        onClick={() => (window.location.href = "/name-setup")}
                        className="w-full bg-primary text-foreground rounded-xl border-2 border-black font-bold h-12"
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Create Link
                      </Button>
                    </div>
                  )}
                </div>

                <DialogContent className="neumorphic-border p-5">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-gray-900 p-0">
                      Edit Payment Link
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 font-medium p-0">
                      Customize your payment link details
                    </DialogDescription>
                  </DialogHeader>
                  <PaymentLinkModal selectedLink={selectedLinkForEdit} />
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="quick">
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Quick receive options coming soon...
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Historty Card */}
        <Card className="border-4 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black">Activity</h2>
            <span className="text-sm text-gray-500 font-bold">
              {events.length} transactions total
            </span>
          </div>

          <Tabs
            value={activeActivityTab}
            onValueChange={setActiveActivityTab}
            className="mb-6"
          >
            <TabsList className="bg-gray-100 border-2 border-black rounded-xl p-1">
              <TabsTrigger
                value="all"
                className="rounded-lg data-[state=active]:bg-black data-[state=active]:text-white font-bold"
              >
                All ({events.length})
              </TabsTrigger>
            </TabsList>

            {historyLoading ? (
              <div className="flex flex-col items-center space-y-4 py-12">
                <Loader2 className="h-8 w-8 animate-spin text-black" />
                <p className="text-black font-black">
                  Loading transaction history...
                </p>
              </div>
            ) : (
              <>
                <TabsContent value="all">
                  {events.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ActivityIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="font-bold text-lg text-gray-600">
                        No Transactions Yet
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Your transaction history will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {events.map((event, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              {"Payment" in event.event_type ? (
                                <DollarSign className="h-5 w-5 text-green-600" />
                              ) : "Transfer" in event.event_type ? (
                                <Banknote className="h-5 w-5 text-red-600" />
                              ) : (
                                <User className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-sm">
                                {formatEventType(event.event_type)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatTimestamp(event.timestamp)}
                              </p>
                              {event.alias && event.alias.length > 0 && (
                                <p className="text-xs text-blue-600">
                                  @{event.alias[0]}
                                </p>
                              )}
                            </div>
                          </div>
                          {event.amount &&
                            event.amount.length > 0 &&
                            event.amount[0] !== undefined && (
                              <div className="text-right">
                                <p className="font-bold text-sm">
                                  {"Payment" in event.event_type ? "+" : "-"}
                                  {formatVPTAmount(event.amount[0])} TPY
                                </p>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

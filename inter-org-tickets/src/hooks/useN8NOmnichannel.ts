/**
 * useN8NOmnichannel
 * Omnichannel inbox — n8n handles channel adapters and message routing.
 * Backed by TanStack Query.
 */
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { n8nPost, N8N_WEBHOOKS } from "@/lib/n8n";

export interface ChannelMessage {
  id: string;
  channelType: "email" | "chat" | "sms" | "social" | "call" | "whatsapp";
  socialPlatform?: "twitter" | "facebook" | "instagram";
  direction: "incoming" | "outgoing";
  content: string;
  timestamp: string;
  sender: { name: string; avatar?: string };
  attachments?: { name: string; size: string; type: string }[];
  ticketId: string;
}

export interface OmnichannelTicket {
  id: string;
  customer: { name: string; email: string; avatar?: string; company?: string };
  subject: string;
  status: "active" | "waiting" | "resolved";
  priority: "low" | "medium" | "high" | "critical";
  channels: { email: boolean; chat: boolean; social: boolean; call: boolean; sms: boolean };
  assignedTo?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

export interface ChannelStatus {
  type: string;
  connected: boolean;
  label: string;
  lastSync?: string;
}

export function useN8NOmnichannel() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const ticketsQuery = useQuery({
    queryKey: ["omni-tickets"],
    queryFn: ({ signal }) =>
      n8nPost<OmnichannelTicket[]>(N8N_WEBHOOKS.OMNI_TICKETS_LIST, {}, signal)
        .then((res) => res.data ?? []),
  });

  const channelStatusQuery = useQuery({
    queryKey: ["omni-channels"],
    queryFn: ({ signal }) =>
      n8nPost<ChannelStatus[]>(N8N_WEBHOOKS.OMNI_CHANNEL_STATUS, {}, signal)
        .then((res) => res.data ?? []),
    staleTime: 120_000,
  });

  const messagesQuery = useQuery({
    queryKey: ["omni-messages", selectedTicketId],
    queryFn: ({ signal }) =>
      n8nPost<ChannelMessage[]>(N8N_WEBHOOKS.OMNI_MESSAGES_LIST, { ticketId: selectedTicketId! }, signal)
        .then((res) => res.data ?? []),
    enabled: !!selectedTicketId,
  });

  const sendMessage = useMutation({
    mutationFn: (vars: { ticketId: string; content: string; channel: ChannelMessage["channelType"] }) =>
      n8nPost(N8N_WEBHOOKS.OMNI_SEND_MESSAGE, vars),
    onSuccess: (_, vars) => {
      toast({ title: "Message sent", description: `Dispatched via ${vars.channel} through n8n` });
      qc.invalidateQueries({ queryKey: ["omni-messages", vars.ticketId] });
    },
    onError: (err: Error) =>
      toast({ title: "Send failed", description: err.message, variant: "destructive" }),
  });

  const selectTicket = useCallback((ticketId: string) => {
    setSelectedTicketId(ticketId);
  }, []);

  return {
    tickets: ticketsQuery.data ?? [],
    messages: messagesQuery.data ?? [],
    channelStatuses: channelStatusQuery.data ?? [],
    loading: ticketsQuery.isLoading,
    selectedTicketId,
    selectTicket,
    sendMessage: (ticketId: string, content: string, channel: ChannelMessage["channelType"]) =>
      sendMessage.mutate({ ticketId, content, channel }),
    reloadTickets: () => qc.invalidateQueries({ queryKey: ["omni-tickets"] }),
  };
}

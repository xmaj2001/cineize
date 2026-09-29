import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { MovieSessionDetail, SessionSeat } from "@/lib/features/sessions/types";

interface ExtendedSessionSeat extends SessionSeat {
  ticketCode?: string;
}

interface PDFProps {
  session: MovieSessionDetail;
  seats: ExtendedSessionSeat[];
  paymentMethod?: string;
}

// Estilos declarativos limpos e 100% suportados
const styles = StyleSheet.create({
  page: {
    padding: 15,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  ticketCard: {
    border: "1px solid #E2E8F0",
    padding: 12,
    marginBottom: 15,
    borderRadius: 4,
  },
  header: {
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderBottomStyle: "dashed",
    paddingBottom: 8,
    marginBottom: 8,
  },
  logo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 8,
    color: "#475569",
    marginTop: 2,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
    color: "#000000",
    textTransform: "uppercase",
  },
  metaText: {
    fontSize: 8,
    color: "#334155",
    marginTop: 2,
  },
  highlightBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    border: "1px solid #CBD5E1",
    padding: 6,
    marginVertical: 8,
    borderRadius: 2,
  },
  boxCol: {
    flexDirection: "column",
  },
  boxLabel: {
    fontSize: 7,
    color: "#64748B",
    fontWeight: "bold",
  },
  boxValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0F172A",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  label: {
    fontSize: 8,
    color: "#475569",
  },
  value: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#0F172A",
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
    borderTopStyle: "dashed",
    marginVertical: 6,
  },
  footerCode: {
    textAlign: "center",
    marginTop: 6,
  },
  codeText: {
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

export function CineizePDFDocument({
  session,
  seats,
  paymentMethod = "Multicaixa Express",
}: PDFProps) {
  const formattedDate = new Date(session.startTime).toLocaleDateString(
    "pt-PT",
    { day: "2-digit", month: "2-digit", year: "numeric" }
  );

  const formattedTime = new Date(session.startTime).toLocaleTimeString(
    "pt-PT",
    { hour: "2-digit", minute: "2-digit" }
  );

  const formatPrice = (val: number) => `${val.toLocaleString("pt-AO")} AKZ`;

  return (
    <Document>
      <Page size={[226, 600]} style={styles.page}>
        {seats.map((seat, index) => {
          const code =
            seat.ticketCode || `CZ-${String(seat.id).padStart(8, "0")}`;
          const seatLabel = `${seat.row}${seat.number}`;

          return (
            <View key={seat.id || index} style={styles.ticketCard} break={index > 0}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.logo}>cineIze</Text>
                <Text style={styles.subtitle}>{session.cinema.name}</Text>
                <Text style={styles.subtitle}>
                  COMPROVATIVO ({index + 1}/{seats.length})
                </Text>
              </View>

              {/* Filme */}
              <View>
                <Text style={{ fontSize: 7, color: "#64748B" }}>FILME:</Text>
                <Text style={styles.title}>{session.movie.title}</Text>
                <Text style={styles.metaText}>
                  {session.format} |{" "}
                  {session.movie.durationMinutes} MIN
                </Text>
              </View>

              {/* Sala e Lugar */}
              <View style={styles.highlightBox}>
                <View style={styles.boxCol}>
                  <Text style={styles.boxLabel}>SALA</Text>
                  <Text style={styles.boxValue}>{session.room}</Text>
                </View>
                <View style={[styles.boxCol, { alignItems: "flex-end" }]}>
                  <Text style={styles.boxLabel}>LUGAR</Text>
                  <Text style={[styles.boxValue, { color: "#1E3A8A" }]}>
                    {seatLabel}
                  </Text>
                </View>
              </View>

              {/* Detalhes */}
              <View style={styles.row}>
                <Text style={styles.label}>SESSÃO:</Text>
                <Text style={styles.value}>{formattedTime}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>DATA:</Text>
                <Text style={styles.value}>{formattedDate}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>TIPO:</Text>
                <Text style={styles.value}>{seat.type}</Text>
              </View>

              <View style={styles.divider} />

              {/* Financeiro */}
              <View style={styles.row}>
                <Text style={styles.label}>PREÇO:</Text>
                <Text style={styles.value}>{formatPrice(session.price)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>PAGAMENTO:</Text>
                <Text style={styles.value}>{paymentMethod}</Text>
              </View>

              <View style={styles.divider} />

              {/* Rodapé / Código */}
              <View style={styles.footerCode}>
                <Text style={styles.codeText}>{code}</Text>
                <Text style={{ fontSize: 6, color: "#64748B", marginTop: 4 }}>
                  CONSERVE ESTE BILHETE PARA O ACESSO
                </Text>
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}

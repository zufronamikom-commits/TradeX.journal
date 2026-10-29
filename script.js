/* =========================================================
   SCRIPT.JS — SEMUA LOGIKA / SISTEM TRADEX.JOURNAL
   Isi file ini (berurutan):
   1. I18N         → kamus terjemahan 6 bahasa
   2. Data         → settings, akun, trade (disimpan di localStorage)
   3. Util         → fungsi bantu (format uang, tanggal, R:R)
   4. Toast/Modal  → notifikasi & pop-up konfirmasi
   5. Navigasi     → pindah antar halaman
   6. Add Trade    → form Basic/Pro, upload gambar, simpan
   7. Journal      → tabel riwayat trade
   8. Dashboard    → statistik, equity curve
   9. Detail       → halaman detail trade
   10. Sertifikat  → membuat gambar sertifikat PNG
   11. Kalender    → kalender P&L
   12. Multi Akun  → switcher & halaman akun
   13. Tema/Bahasa → ganti tema & bahasa
   14. Export/Import → backup data JSON
   15. Strategy    → kartu setup
   16. Lightbox    → lihat screenshot besar
   17. Mobile      → header & menu HP
   18. Kalender News → data berita Forex Factory
   19. INIT        → menjalankan semuanya saat halaman dibuka
   ========================================================= */


/* =========================================================
   1. I18N — kamus terjemahan (global-ready)
   Setiap bahasa punya kunci yang sama. Elemen HTML dengan
   atribut data-i18n="kunci" akan otomatis diganti teksnya.
   ========================================================= */
const I18N = {
  id: {
    nav_dashboard:"Dashboard", nav_journal:"Journal", nav_add:"Tambah trade", nav_detail:"Detail trade", nav_calendar:"Kalender", nav_settings:"Pengaturan", nav_reset:"Reset data",
    dash_title:"Dashboard", dash_sub:"Ringkasan performa trading kamu — otomatis dari data journal",
    m_total_pl:"Total P&L", m_win_rate:"Win rate", m_avg_rr:"Avg. R:R", m_total_trades:"Total trade",
    m_profit_factor:"Profit factor", m_best_trade:"Trade terbaik", m_worst_trade:"Trade terburuk", m_max_dd:"Max drawdown",
    card_equity:"Equity curve", card_pair_perf:"Performa per pair", card_recent:"Trade terbaru",
    empty_data:"Belum ada data.", empty_recent:"Belum ada trade. Yuk tambah trade pertamamu.",
    th_date:"Tanggal", th_pair:"Pair", th_dir:"Arah", th_rr:"R:R", th_result:"Hasil", th_entry:"Entry", th_exit:"Exit",
    journal_title:"Journal", journal_sub:"Semua riwayat trade kamu — klik baris untuk lihat detail",
    filter_all:"Semua", filter_profit:"Profit", filter_loss:"Loss", search_ph:"Cari pair, tag, atau alasan...",
    empty_journal_filtered:"Belum ada trade yang cocok dengan filter ini.",
    add_title_new:"Tambah trade", add_title_edit:"Edit trade", add_sub:"Isi data trade, lalu lanjut ke tab Refleksi sebelum menyimpan",
    tab_data:"Data trade", tab_reflection:"Refleksi",
    lbl_date:"Tanggal",
    lbl_pair:"Pair *", lbl_dir:"Arah *", lbl_entry:"Entry price *", lbl_exit:"Exit price *", lbl_sl:"Stop loss", lbl_tp:"Take profit",
    lbl_lot:"Lot size", lbl_result:"Hasil *", lbl_rr_auto:"R:R (otomatis dari Entry/SL/TP)", lbl_reason:"Alasan setup", lbl_emotion:"Catatan emosi", lbl_tags:"Tag / strategi",
    ph_pair:"XAUUSD", ph_entry:"2318.40", ph_exit:"2324.10", ph_sl:"2315.00", ph_tp:"2326.00", ph_lot:"0.10", ph_result:"185.00 atau -42.00",
    ph_reason:"Breakout support + konfirmasi H1", ph_emotion:"Tenang saat entry, sempat ragu waktu harga retest...", ph_tags:"breakout, news, scalping",
    dropzone_text:"Tarik screenshot chart ke sini, atau klik untuk unggah", btn_cancel:"Batal", btn_save:"Simpan trade",
    msg_required:"Lengkapi minimal: Pair, Entry, Exit, dan Hasil sebelum menyimpan.",
    opt_buy:"Buy", opt_sell:"Sell",
    detail_title_default:"Detail trade", detail_sub_default:"Belum ada trade dipilih",
    btn_edit:"Edit", btn_delete:"Hapus", btn_cert:"Unduh Sertifikat",
    kv_pair:"Pair", kv_dir:"Arah", kv_entry:"Entry", kv_exit:"Exit", kv_sl:"Stop loss", kv_tp:"Take profit", kv_lot:"Lot", kv_rr:"R:R", kv_result:"Hasil", kv_tags:"Tag",
    note_reason:"Alasan setup", note_emotion:"Catatan emosi", note_empty:"— tidak diisi —",
    img_empty:"Belum ada screenshot",
    detail_empty_msg:"Belum ada trade dipilih. Buka Journal lalu klik salah satu trade, atau tambah trade baru.",
    cal_title:"Kalender P&L", cal_sub:"P&L harian mengikuti data trade yang tersimpan",
    settings_title:"Pengaturan", settings_sub:"Kelola akun, tampilan, dan data kamu",
    lbl_username:"Username", lbl_currency:"Mata uang akun", lbl_language:"Bahasa", lbl_theme:"Tema tampilan",
    theme_dark:"Gelap", theme_light:"Terang", btn_save_settings:"Simpan perubahan",
    data_mgmt_title:"Manajemen data", data_mgmt_sub:"Cadangkan atau pulihkan seluruh data trade kamu dalam format JSON",
    btn_export:"Export data", btn_import:"Import data",
    modal_reset_title:"Reset semua data?", modal_reset_msg:"Semua trade dan pengaturan yang tersimpan di browser ini akan dihapus permanen. Aksi ini tidak bisa dibatalkan.",
    modal_delete_title:"Hapus trade ini?", modal_delete_msg:"Trade ini akan dihapus permanen dari journal kamu.",
    modal_confirm:"Ya, lanjutkan", modal_cancel:"Batal",
    toast_saved:"Trade berhasil disimpan.", toast_deleted:"Trade berhasil dihapus.", toast_settings_saved:"Pengaturan disimpan.",
    toast_exported:"Data berhasil diekspor.", toast_imported:"Data berhasil diimpor.", toast_import_error:"Gagal mengimpor file. Pastikan formatnya benar.",
    toast_reset_done:"Semua data telah direset.", toast_no_trade_selected:"Pilih trade dulu sebelum membuat sertifikat.",
    toast_cert_making:"Membuat sertifikat...", toast_cert_error:"Gagal membuat sertifikat. Coba lagi.",
    cert_serial_label:"No. Sertifikat", cert_eyebrow:"SERTIFIKAT TRADE", cert_subtitle:"Hasil Transaksi Trading", cert_pnl_label:"Hasil",
    cert_rr_label:"Risk : Reward", cert_lot_label:"Lot", cert_entry_label:"Entry", cert_exit_label:"Exit", cert_date_label:"Tanggal",
    cert_sl_label:"Stop Loss", cert_tp_label:"Take Profit", cert_pair_label:"Pair", cert_note_label:"Catatan",
    cert_foot_prefix:"Dibuat otomatis dari Tradex.journal", cert_setup_label:"Setup:", cert_verified:"TERVERIFIKASI", cert_no_setup:"Tidak diisi",
    cert_trader_label:"Atas Nama"
  },
  en: {
    nav_dashboard:"Dashboard", nav_journal:"Journal", nav_add:"Add trade", nav_detail:"Trade detail", nav_calendar:"Calendar", nav_settings:"Settings", nav_reset:"Reset data",
    dash_title:"Dashboard", dash_sub:"A summary of your trading performance — generated automatically from your journal",
    m_total_pl:"Total P&L", m_win_rate:"Win rate", m_avg_rr:"Avg. R:R", m_total_trades:"Total trades",
    m_profit_factor:"Profit factor", m_best_trade:"Best trade", m_worst_trade:"Worst trade", m_max_dd:"Max drawdown",
    card_equity:"Equity curve", card_pair_perf:"Performance by pair", card_recent:"Recent trades",
    empty_data:"No data yet.", empty_recent:"No trades yet. Add your first trade to get started.",
    th_date:"Date", th_pair:"Pair", th_dir:"Direction", th_rr:"R:R", th_result:"Result", th_entry:"Entry", th_exit:"Exit",
    journal_title:"Journal", journal_sub:"Your full trade history — click a row to see the details",
    filter_all:"All", filter_profit:"Profit", filter_loss:"Loss", search_ph:"Search pair, tag, or reason...",
    empty_journal_filtered:"No trades match this filter.",
    add_title_new:"Add trade", add_title_edit:"Edit trade", add_sub:"Fill in the trade details, then switch to the Reflection tab before saving",
    tab_data:"Trade data", tab_reflection:"Reflection",
    lbl_date:"Date",
    lbl_pair:"Pair *", lbl_dir:"Direction *", lbl_entry:"Entry price *", lbl_exit:"Exit price *", lbl_sl:"Stop loss", lbl_tp:"Take profit",
    lbl_lot:"Lot size", lbl_result:"Result *", lbl_rr_auto:"R:R (auto from Entry/SL/TP)", lbl_reason:"Setup reason", lbl_emotion:"Emotion notes", lbl_tags:"Tags / strategy",
    ph_pair:"XAUUSD", ph_entry:"2318.40", ph_exit:"2324.10", ph_sl:"2315.00", ph_tp:"2326.00", ph_lot:"0.10", ph_result:"185.00 or -42.00",
    ph_reason:"Support breakout + H1 confirmation", ph_emotion:"Calm on entry, hesitated a bit on the retest...", ph_tags:"breakout, news, scalping",
    dropzone_text:"Drag a chart screenshot here, or click to upload", btn_cancel:"Cancel", btn_save:"Save trade",
    msg_required:"Please fill in at least: Pair, Entry, Exit, and Result before saving.",
    opt_buy:"Buy", opt_sell:"Sell",
    detail_title_default:"Trade detail", detail_sub_default:"No trade selected",
    btn_edit:"Edit", btn_delete:"Delete", btn_cert:"Download certificate",
    kv_pair:"Pair", kv_dir:"Direction", kv_entry:"Entry", kv_exit:"Exit", kv_sl:"Stop loss", kv_tp:"Take profit", kv_lot:"Lot", kv_rr:"R:R", kv_result:"Result", kv_tags:"Tags",
    note_reason:"Setup reason", note_emotion:"Emotion notes", note_empty:"— not filled in —",
    img_empty:"No screenshot yet",
    detail_empty_msg:"No trade selected. Open Journal and click a trade, or add a new one.",
    cal_title:"P&L calendar", cal_sub:"Daily P&L follows your saved trade data",
    settings_title:"Settings", settings_sub:"Manage your account, appearance, and data",
    lbl_username:"Username", lbl_currency:"Account currency", lbl_language:"Language", lbl_theme:"Appearance",
    theme_dark:"Dark", theme_light:"Light", btn_save_settings:"Save changes",
    data_mgmt_title:"Data management", data_mgmt_sub:"Back up or restore all your trade data as a JSON file",
    btn_export:"Export data", btn_import:"Import data",
    modal_reset_title:"Reset all data?", modal_reset_msg:"All trades and settings saved in this browser will be permanently deleted. This cannot be undone.",
    modal_delete_title:"Delete this trade?", modal_delete_msg:"This trade will be permanently removed from your journal.",
    modal_confirm:"Yes, continue", modal_cancel:"Cancel",
    toast_saved:"Trade saved successfully.", toast_deleted:"Trade deleted.", toast_settings_saved:"Settings saved.",
    toast_exported:"Data exported successfully.", toast_imported:"Data imported successfully.", toast_import_error:"Couldn't import that file. Please check the format.",
    toast_reset_done:"All data has been reset.", toast_no_trade_selected:"Select a trade first before creating a certificate.",
    toast_cert_making:"Creating certificate...", toast_cert_error:"Couldn't create the certificate. Please try again.",
    cert_serial_label:"Certificate No.", cert_eyebrow:"TRADE CERTIFICATE", cert_subtitle:"Trading Transaction Result", cert_pnl_label:"Result",
    cert_rr_label:"Risk : Reward", cert_lot_label:"Lot", cert_entry_label:"Entry", cert_exit_label:"Exit", cert_date_label:"Date",
    cert_sl_label:"Stop Loss", cert_tp_label:"Take Profit", cert_pair_label:"Pair", cert_note_label:"Notes",
    cert_foot_prefix:"Auto-generated by Tradex.journal", cert_setup_label:"Setup:", cert_verified:"VERIFIED", cert_no_setup:"Not filled in",
    cert_trader_label:"Issued To"
  },
  es: {
    nav_dashboard:"Panel", nav_journal:"Diario", nav_add:"Añadir operación", nav_detail:"Detalle", nav_calendar:"Calendario", nav_settings:"Ajustes", nav_reset:"Restablecer datos",
    dash_title:"Panel", dash_sub:"Resumen de tu rendimiento de trading — generado automáticamente desde tu diario",
    m_total_pl:"P&L total", m_win_rate:"Tasa de acierto", m_avg_rr:"R:R promedio", m_total_trades:"Operaciones totales",
    m_profit_factor:"Factor de beneficio", m_best_trade:"Mejor operación", m_worst_trade:"Peor operación", m_max_dd:"Drawdown máximo",
    card_equity:"Curva de capital", card_pair_perf:"Rendimiento por par", card_recent:"Operaciones recientes",
    empty_data:"Aún no hay datos.", empty_recent:"Aún no hay operaciones. Añade tu primera operación.",
    th_date:"Fecha", th_pair:"Par", th_dir:"Dirección", th_rr:"R:R", th_result:"Resultado", th_entry:"Entrada", th_exit:"Salida",
    journal_title:"Diario", journal_sub:"Todo tu historial de operaciones — haz clic en una fila para ver el detalle",
    filter_all:"Todas", filter_profit:"Ganancia", filter_loss:"Pérdida", search_ph:"Buscar par, etiqueta o motivo...",
    empty_journal_filtered:"Ninguna operación coincide con este filtro.",
    add_title_new:"Añadir operación", add_title_edit:"Editar operación", add_sub:"Completa los datos y luego ve a la pestaña Reflexión antes de guardar",
    tab_data:"Datos de la operación", tab_reflection:"Reflexión",
    lbl_date:"Fecha",
    lbl_pair:"Par *", lbl_dir:"Dirección *", lbl_entry:"Precio de entrada *", lbl_exit:"Precio de salida *", lbl_sl:"Stop loss", lbl_tp:"Take profit",
    lbl_lot:"Tamaño del lote", lbl_result:"Resultado *", lbl_rr_auto:"R:R (automático desde Entrada/SL/TP)", lbl_reason:"Motivo del setup", lbl_emotion:"Notas emocionales", lbl_tags:"Etiquetas / estrategia",
    ph_pair:"XAUUSD", ph_entry:"2318.40", ph_exit:"2324.10", ph_sl:"2315.00", ph_tp:"2326.00", ph_lot:"0.10", ph_result:"185.00 o -42.00",
    ph_reason:"Ruptura de soporte + confirmación H1", ph_emotion:"Tranquilo en la entrada, algo de duda en el retest...", ph_tags:"ruptura, noticias, scalping",
    dropzone_text:"Arrastra una captura del gráfico aquí, o haz clic para subir", btn_cancel:"Cancelar", btn_save:"Guardar operación",
    msg_required:"Completa al menos: Par, Entrada, Salida y Resultado antes de guardar.",
    opt_buy:"Compra", opt_sell:"Venta",
    detail_title_default:"Detalle de operación", detail_sub_default:"Ninguna operación seleccionada",
    btn_edit:"Editar", btn_delete:"Eliminar", btn_cert:"Descargar certificado",
    kv_pair:"Par", kv_dir:"Dirección", kv_entry:"Entrada", kv_exit:"Salida", kv_sl:"Stop loss", kv_tp:"Take profit", kv_lot:"Lote", kv_rr:"R:R", kv_result:"Resultado", kv_tags:"Etiquetas",
    note_reason:"Motivo del setup", note_emotion:"Notas emocionales", note_empty:"— sin completar —",
    img_empty:"Aún no hay captura",
    detail_empty_msg:"Ninguna operación seleccionada. Abre el Diario y haz clic en una, o añade una nueva.",
    cal_title:"Calendario de P&L", cal_sub:"El P&L diario sigue tus operaciones guardadas",
    settings_title:"Ajustes", settings_sub:"Gestiona tu cuenta, apariencia y datos",
    lbl_username:"Usuario", lbl_currency:"Moneda de la cuenta", lbl_language:"Idioma", lbl_theme:"Apariencia",
    theme_dark:"Oscuro", theme_light:"Claro", btn_save_settings:"Guardar cambios",
    data_mgmt_title:"Gestión de datos", data_mgmt_sub:"Respalda o restaura todos tus datos de operaciones en formato JSON",
    btn_export:"Exportar datos", btn_import:"Importar datos",
    modal_reset_title:"¿Restablecer todos los datos?", modal_reset_msg:"Todas las operaciones y ajustes guardados en este navegador se eliminarán permanentemente. Esta acción no se puede deshacer.",
    modal_delete_title:"¿Eliminar esta operación?", modal_delete_msg:"Esta operación se eliminará permanentemente de tu diario.",
    modal_confirm:"Sí, continuar", modal_cancel:"Cancelar",
    toast_saved:"Operación guardada correctamente.", toast_deleted:"Operación eliminada.", toast_settings_saved:"Ajustes guardados.",
    toast_exported:"Datos exportados correctamente.", toast_imported:"Datos importados correctamente.", toast_import_error:"No se pudo importar el archivo. Verifica el formato.",
    toast_reset_done:"Todos los datos han sido restablecidos.", toast_no_trade_selected:"Selecciona una operación antes de crear un certificado.",
    toast_cert_making:"Creando certificado...", toast_cert_error:"No se pudo crear el certificado. Inténtalo de nuevo.",
    cert_serial_label:"N.º de certificado", cert_eyebrow:"CERTIFICADO DE OPERACIÓN", cert_subtitle:"Resultado de la transacción", cert_pnl_label:"Resultado",
    cert_rr_label:"Riesgo : Beneficio", cert_lot_label:"Lote", cert_entry_label:"Entrada", cert_exit_label:"Salida", cert_date_label:"Fecha",
    cert_sl_label:"Stop Loss", cert_tp_label:"Take Profit", cert_pair_label:"Par", cert_note_label:"Notas",
    cert_foot_prefix:"Generado automáticamente por Tradex.journal", cert_setup_label:"Setup:", cert_verified:"VERIFICADO", cert_no_setup:"Sin completar",
    cert_trader_label:"A nombre de"
  },
  fr: {
    nav_dashboard:"Tableau de bord", nav_journal:"Journal", nav_add:"Ajouter un trade", nav_detail:"Détail du trade", nav_calendar:"Calendrier", nav_settings:"Paramètres", nav_reset:"Réinitialiser",
    dash_title:"Tableau de bord", dash_sub:"Résumé de votre performance de trading — généré automatiquement à partir du journal",
    m_total_pl:"P&L total", m_win_rate:"Taux de réussite", m_avg_rr:"R:R moyen", m_total_trades:"Total des trades",
    m_profit_factor:"Facteur de profit", m_best_trade:"Meilleur trade", m_worst_trade:"Pire trade", m_max_dd:"Drawdown max",
    card_equity:"Courbe de capital", card_pair_perf:"Performance par paire", card_recent:"Trades récents",
    empty_data:"Aucune donnée pour l'instant.", empty_recent:"Aucun trade pour l'instant. Ajoutez votre premier trade.",
    th_date:"Date", th_pair:"Paire", th_dir:"Sens", th_rr:"R:R", th_result:"Résultat", th_entry:"Entrée", th_exit:"Sortie",
    journal_title:"Journal", journal_sub:"Tout votre historique de trades — cliquez sur une ligne pour voir le détail",
    filter_all:"Tous", filter_profit:"Profit", filter_loss:"Perte", search_ph:"Rechercher une paire, un tag ou un motif...",
    empty_journal_filtered:"Aucun trade ne correspond à ce filtre.",
    add_title_new:"Ajouter un trade", add_title_edit:"Modifier le trade", add_sub:"Renseignez les données puis passez à l'onglet Réflexion avant d'enregistrer",
    tab_data:"Données du trade", tab_reflection:"Réflexion",
    lbl_date:"Date",
    lbl_pair:"Paire *", lbl_dir:"Sens *", lbl_entry:"Prix d'entrée *", lbl_exit:"Prix de sortie *", lbl_sl:"Stop loss", lbl_tp:"Take profit",
    lbl_lot:"Taille du lot", lbl_result:"Résultat *", lbl_rr_auto:"R:R (auto depuis Entrée/SL/TP)", lbl_reason:"Raison du setup", lbl_emotion:"Notes émotionnelles", lbl_tags:"Tags / stratégie",
    ph_pair:"XAUUSD", ph_entry:"2318.40", ph_exit:"2324.10", ph_sl:"2315.00", ph_tp:"2326.00", ph_lot:"0.10", ph_result:"185.00 ou -42.00",
    ph_reason:"Cassure de support + confirmation H1", ph_emotion:"Calme à l'entrée, un peu d'hésitation sur le retest...", ph_tags:"cassure, actualités, scalping",
    dropzone_text:"Glissez une capture du graphique ici, ou cliquez pour importer", btn_cancel:"Annuler", btn_save:"Enregistrer le trade",
    msg_required:"Renseignez au moins : Paire, Entrée, Sortie et Résultat avant d'enregistrer.",
    opt_buy:"Achat", opt_sell:"Vente",
    detail_title_default:"Détail du trade", detail_sub_default:"Aucun trade sélectionné",
    btn_edit:"Modifier", btn_delete:"Supprimer", btn_cert:"Télécharger le certificat",
    kv_pair:"Paire", kv_dir:"Sens", kv_entry:"Entrée", kv_exit:"Sortie", kv_sl:"Stop loss", kv_tp:"Take profit", kv_lot:"Lot", kv_rr:"R:R", kv_result:"Résultat", kv_tags:"Tags",
    note_reason:"Raison du setup", note_emotion:"Notes émotionnelles", note_empty:"— non renseigné —",
    img_empty:"Pas encore de capture",
    detail_empty_msg:"Aucun trade sélectionné. Ouvrez le Journal et cliquez sur un trade, ou ajoutez-en un nouveau.",
    cal_title:"Calendrier P&L", cal_sub:"Le P&L quotidien suit vos trades enregistrés",
    settings_title:"Paramètres", settings_sub:"Gérez votre compte, l'apparence et vos données",
    lbl_username:"Nom d'utilisateur", lbl_currency:"Devise du compte", lbl_language:"Langue", lbl_theme:"Apparence",
    theme_dark:"Sombre", theme_light:"Clair", btn_save_settings:"Enregistrer les modifications",
    data_mgmt_title:"Gestion des données", data_mgmt_sub:"Sauvegardez ou restaurez toutes vos données de trades au format JSON",
    btn_export:"Exporter les données", btn_import:"Importer des données",
    modal_reset_title:"Réinitialiser toutes les données ?", modal_reset_msg:"Tous les trades et paramètres enregistrés dans ce navigateur seront supprimés définitivement. Action irréversible.",
    modal_delete_title:"Supprimer ce trade ?", modal_delete_msg:"Ce trade sera définitivement supprimé de votre journal.",
    modal_confirm:"Oui, continuer", modal_cancel:"Annuler",
    toast_saved:"Trade enregistré avec succès.", toast_deleted:"Trade supprimé.", toast_settings_saved:"Paramètres enregistrés.",
    toast_exported:"Données exportées avec succès.", toast_imported:"Données importées avec succès.", toast_import_error:"Impossible d'importer ce fichier. Vérifiez le format.",
    toast_reset_done:"Toutes les données ont été réinitialisées.", toast_no_trade_selected:"Sélectionnez un trade avant de créer un certificat.",
    toast_cert_making:"Création du certificat...", toast_cert_error:"Impossible de créer le certificat. Réessayez.",
    cert_serial_label:"N° de certificat", cert_eyebrow:"CERTIFICAT DE TRADE", cert_subtitle:"Résultat de la transaction", cert_pnl_label:"Résultat",
    cert_rr_label:"Risque : Récompense", cert_lot_label:"Lot", cert_entry_label:"Entrée", cert_exit_label:"Sortie", cert_date_label:"Date",
    cert_sl_label:"Stop Loss", cert_tp_label:"Take Profit", cert_pair_label:"Paire", cert_note_label:"Notes",
    cert_foot_prefix:"Généré automatiquement par Tradex.journal", cert_setup_label:"Setup :", cert_verified:"VÉRIFIÉ", cert_no_setup:"Non renseigné",
    cert_trader_label:"Au nom de"
  },
  pt: {
    nav_dashboard:"Painel", nav_journal:"Diário", nav_add:"Adicionar trade", nav_detail:"Detalhe do trade", nav_calendar:"Calendário", nav_settings:"Configurações", nav_reset:"Redefinir dados",
    dash_title:"Painel", dash_sub:"Resumo do seu desempenho de trading — gerado automaticamente a partir do diário",
    m_total_pl:"P&L total", m_win_rate:"Taxa de acerto", m_avg_rr:"R:R médio", m_total_trades:"Total de trades",
    m_profit_factor:"Fator de lucro", m_best_trade:"Melhor trade", m_worst_trade:"Pior trade", m_max_dd:"Drawdown máximo",
    card_equity:"Curva de capital", card_pair_perf:"Desempenho por par", card_recent:"Trades recentes",
    empty_data:"Ainda não há dados.", empty_recent:"Ainda não há trades. Adicione seu primeiro trade.",
    th_date:"Data", th_pair:"Par", th_dir:"Direção", th_rr:"R:R", th_result:"Resultado", th_entry:"Entrada", th_exit:"Saída",
    journal_title:"Diário", journal_sub:"Todo o seu histórico de trades — clique em uma linha para ver o detalhe",
    filter_all:"Todos", filter_profit:"Lucro", filter_loss:"Prejuízo", search_ph:"Buscar par, tag ou motivo...",
    empty_journal_filtered:"Nenhum trade corresponde a este filtro.",
    add_title_new:"Adicionar trade", add_title_edit:"Editar trade", add_sub:"Preencha os dados e vá para a aba Reflexão antes de salvar",
    tab_data:"Dados do trade", tab_reflection:"Reflexão",
    lbl_date:"Data",
    lbl_pair:"Par *", lbl_dir:"Direção *", lbl_entry:"Preço de entrada *", lbl_exit:"Preço de saída *", lbl_sl:"Stop loss", lbl_tp:"Take profit",
    lbl_lot:"Tamanho do lote", lbl_result:"Resultado *", lbl_rr_auto:"R:R (automático de Entrada/SL/TP)", lbl_reason:"Motivo do setup", lbl_emotion:"Notas emocionais", lbl_tags:"Tags / estratégia",
    ph_pair:"XAUUSD", ph_entry:"2318.40", ph_exit:"2324.10", ph_sl:"2315.00", ph_tp:"2326.00", ph_lot:"0.10", ph_result:"185.00 ou -42.00",
    ph_reason:"Rompimento de suporte + confirmação H1", ph_emotion:"Calmo na entrada, um pouco de hesitação no reteste...", ph_tags:"rompimento, notícias, scalping",
    dropzone_text:"Arraste uma captura do gráfico aqui, ou clique para enviar", btn_cancel:"Cancelar", btn_save:"Salvar trade",
    msg_required:"Preencha pelo menos: Par, Entrada, Saída e Resultado antes de salvar.",
    opt_buy:"Compra", opt_sell:"Venda",
    detail_title_default:"Detalhe do trade", detail_sub_default:"Nenhum trade selecionado",
    btn_edit:"Editar", btn_delete:"Excluir", btn_cert:"Baixar certificado",
    kv_pair:"Par", kv_dir:"Direção", kv_entry:"Entrada", kv_exit:"Saída", kv_sl:"Stop loss", kv_tp:"Take profit", kv_lot:"Lote", kv_rr:"R:R", kv_result:"Resultado", kv_tags:"Tags",
    note_reason:"Motivo do setup", note_emotion:"Notas emocionais", note_empty:"— não preenchido —",
    img_empty:"Ainda não há captura",
    detail_empty_msg:"Nenhum trade selecionado. Abra o Diário e clique em um trade, ou adicione um novo.",
    cal_title:"Calendário de P&L", cal_sub:"O P&L diário segue os trades salvos",
    settings_title:"Configurações", settings_sub:"Gerencie sua conta, aparência e dados",
    lbl_username:"Usuário", lbl_currency:"Moeda da conta", lbl_language:"Idioma", lbl_theme:"Aparência",
    theme_dark:"Escuro", theme_light:"Claro", btn_save_settings:"Salvar alterações",
    data_mgmt_title:"Gerenciamento de dados", data_mgmt_sub:"Faça backup ou restaure todos os seus dados de trades em formato JSON",
    btn_export:"Exportar dados", btn_import:"Importar dados",
    modal_reset_title:"Redefinir todos os dados?", modal_reset_msg:"Todos os trades e configurações salvos neste navegador serão excluídos permanentemente. Esta ação não pode ser desfeita.",
    modal_delete_title:"Excluir este trade?", modal_delete_msg:"Este trade será removido permanentemente do seu diário.",
    modal_confirm:"Sim, continuar", modal_cancel:"Cancelar",
    toast_saved:"Trade salvo com sucesso.", toast_deleted:"Trade excluído.", toast_settings_saved:"Configurações salvas.",
    toast_exported:"Dados exportados com sucesso.", toast_imported:"Dados importados com sucesso.", toast_import_error:"Não foi possível importar o arquivo. Verifique o formato.",
    toast_reset_done:"Todos os dados foram redefinidos.", toast_no_trade_selected:"Selecione um trade antes de criar um certificado.",
    toast_cert_making:"Criando certificado...", toast_cert_error:"Não foi possível criar o certificado. Tente novamente.",
    cert_serial_label:"N.º do certificado", cert_eyebrow:"CERTIFICADO DE TRADE", cert_subtitle:"Resultado da transação", cert_pnl_label:"Resultado",
    cert_rr_label:"Risco : Retorno", cert_lot_label:"Lote", cert_entry_label:"Entrada", cert_exit_label:"Saída", cert_date_label:"Data",
    cert_sl_label:"Stop Loss", cert_tp_label:"Take Profit", cert_pair_label:"Par", cert_note_label:"Notas",
    cert_foot_prefix:"Gerado automaticamente pelo Tradex.journal", cert_setup_label:"Setup:", cert_verified:"VERIFICADO", cert_no_setup:"Não preenchido",
    cert_trader_label:"Em nome de"
  },
  de: {
    nav_dashboard:"Dashboard", nav_journal:"Journal", nav_add:"Trade hinzufügen", nav_detail:"Trade-Details", nav_calendar:"Kalender", nav_settings:"Einstellungen", nav_reset:"Daten zurücksetzen",
    dash_title:"Dashboard", dash_sub:"Zusammenfassung deiner Trading-Performance — automatisch aus dem Journal erstellt",
    m_total_pl:"Gesamt-P&L", m_win_rate:"Trefferquote", m_avg_rr:"Ø CRV", m_total_trades:"Trades gesamt",
    m_profit_factor:"Profitfaktor", m_best_trade:"Bester Trade", m_worst_trade:"Schlechtester Trade", m_max_dd:"Max. Drawdown",
    card_equity:"Kapitalkurve", card_pair_perf:"Performance nach Paar", card_recent:"Letzte Trades",
    empty_data:"Noch keine Daten.", empty_recent:"Noch keine Trades. Füge deinen ersten Trade hinzu.",
    th_date:"Datum", th_pair:"Paar", th_dir:"Richtung", th_rr:"CRV", th_result:"Ergebnis", th_entry:"Einstieg", th_exit:"Ausstieg",
    journal_title:"Journal", journal_sub:"Deine gesamte Trade-Historie — klicke eine Zeile für Details an",
    filter_all:"Alle", filter_profit:"Gewinn", filter_loss:"Verlust", search_ph:"Paar, Tag oder Grund suchen...",
    empty_journal_filtered:"Kein Trade passt zu diesem Filter.",
    add_title_new:"Trade hinzufügen", add_title_edit:"Trade bearbeiten", add_sub:"Fülle die Daten aus und wechsle vor dem Speichern zum Tab Reflexion",
    tab_data:"Trade-Daten", tab_reflection:"Reflexion",
    lbl_date:"Datum",
    lbl_pair:"Paar *", lbl_dir:"Richtung *", lbl_entry:"Einstiegspreis *", lbl_exit:"Ausstiegspreis *", lbl_sl:"Stop Loss", lbl_tp:"Take Profit",
    lbl_lot:"Lotgröße", lbl_result:"Ergebnis *", lbl_rr_auto:"CRV (automatisch aus Einstieg/SL/TP)", lbl_reason:"Setup-Begründung", lbl_emotion:"Emotionale Notizen", lbl_tags:"Tags / Strategie",
    ph_pair:"XAUUSD", ph_entry:"2318.40", ph_exit:"2324.10", ph_sl:"2315.00", ph_tp:"2326.00", ph_lot:"0.10", ph_result:"185.00 oder -42.00",
    ph_reason:"Support-Ausbruch + H1-Bestätigung", ph_emotion:"Ruhig beim Einstieg, kurz gezögert beim Retest...", ph_tags:"Ausbruch, News, Scalping",
    dropzone_text:"Chart-Screenshot hierher ziehen oder klicken zum Hochladen", btn_cancel:"Abbrechen", btn_save:"Trade speichern",
    msg_required:"Bitte mindestens ausfüllen: Paar, Einstieg, Ausstieg und Ergebnis vor dem Speichern.",
    opt_buy:"Kauf", opt_sell:"Verkauf",
    detail_title_default:"Trade-Details", detail_sub_default:"Kein Trade ausgewählt",
    btn_edit:"Bearbeiten", btn_delete:"Löschen", btn_cert:"Zertifikat herunterladen",
    kv_pair:"Paar", kv_dir:"Richtung", kv_entry:"Einstieg", kv_exit:"Ausstieg", kv_sl:"Stop Loss", kv_tp:"Take Profit", kv_lot:"Lot", kv_rr:"CRV", kv_result:"Ergebnis", kv_tags:"Tags",
    note_reason:"Setup-Begründung", note_emotion:"Emotionale Notizen", note_empty:"— nicht ausgefüllt —",
    img_empty:"Noch kein Screenshot",
    detail_empty_msg:"Kein Trade ausgewählt. Öffne das Journal und klicke einen Trade an, oder füge einen neuen hinzu.",
    cal_title:"P&L-Kalender", cal_sub:"Der tägliche P&L folgt deinen gespeicherten Trades",
    settings_title:"Einstellungen", settings_sub:"Verwalte Konto, Erscheinungsbild und Daten",
    lbl_username:"Benutzername", lbl_currency:"Kontowährung", lbl_language:"Sprache", lbl_theme:"Erscheinungsbild",
    theme_dark:"Dunkel", theme_light:"Hell", btn_save_settings:"Änderungen speichern",
    data_mgmt_title:"Datenverwaltung", data_mgmt_sub:"Sichere oder stelle alle Trade-Daten als JSON-Datei wieder her",
    btn_export:"Daten exportieren", btn_import:"Daten importieren",
    modal_reset_title:"Alle Daten zurücksetzen?", modal_reset_msg:"Alle in diesem Browser gespeicherten Trades und Einstellungen werden dauerhaft gelöscht. Dies kann nicht rückgängig gemacht werden.",
    modal_delete_title:"Diesen Trade löschen?", modal_delete_msg:"Dieser Trade wird dauerhaft aus deinem Journal entfernt.",
    modal_confirm:"Ja, fortfahren", modal_cancel:"Abbrechen",
    toast_saved:"Trade erfolgreich gespeichert.", toast_deleted:"Trade gelöscht.", toast_settings_saved:"Einstellungen gespeichert.",
    toast_exported:"Daten erfolgreich exportiert.", toast_imported:"Daten erfolgreich importiert.", toast_import_error:"Datei konnte nicht importiert werden. Bitte Format prüfen.",
    toast_reset_done:"Alle Daten wurden zurückgesetzt.", toast_no_trade_selected:"Wähle zuerst einen Trade aus, bevor du ein Zertifikat erstellst.",
    toast_cert_making:"Zertifikat wird erstellt...", toast_cert_error:"Zertifikat konnte nicht erstellt werden. Bitte erneut versuchen.",
    cert_serial_label:"Zertifikat-Nr.", cert_eyebrow:"TRADE-ZERTIFIKAT", cert_subtitle:"Ergebnis der Trading-Transaktion", cert_pnl_label:"Ergebnis",
    cert_rr_label:"Risiko : Ertrag", cert_lot_label:"Lot", cert_entry_label:"Einstieg", cert_exit_label:"Ausstieg", cert_date_label:"Datum",
    cert_sl_label:"Stop Loss", cert_tp_label:"Take Profit", cert_pair_label:"Paar", cert_note_label:"Notizen",
    cert_foot_prefix:"Automatisch erstellt von Tradex.journal", cert_setup_label:"Setup:", cert_verified:"VERIFIZIERT", cert_no_setup:"Nicht ausgefüllt",
    cert_trader_label:"Im Namen von"
  }
};

/* Teks fitur multi-akun (ID + EN; bahasa lain otomatis pakai English) */
const ACC_I18N = {
  id: {
    lbl_currency:"Mata uang default akun baru",
    acc_title:"Akun Journal", acc_sub:"Kelola beberapa journal trading dari satu tempat",
    acc_add:"Tambah akun journal", acc_active:"Aktif", acc_manage:"Kelola akun",
    acc_equity:"Equity saat ini", acc_netpl:"Net P&L", acc_no_broker:"Broker belum diisi",
    acc_root:"Akun Journal Saya", acc_new_title:"Akun journal baru",
    acc_tab_dashboard:"Dashboard", acc_tab_trades:"Trade", acc_tab_stats:"Statistik", acc_tab_settings:"Pengaturan",
    acc_chip_broker:"Broker", acc_chip_platform:"Platform", acc_chip_currency:"Mata uang",
    acc_settings_title:"Pengaturan Akun", acc_settings_sub:"Kelola detail akun tanpa mengubah preferensi global aplikasi.",
    acc_basic:"Informasi dasar", acc_f_name:"Nama akun", acc_f_broker:"Broker / Prop Firm", acc_f_broker_ph:"Masukkan nama broker",
    acc_f_platform:"Platform", acc_f_type:"Tipe akun", acc_f_currency:"Mata uang", acc_f_balance:"Saldo awal",
    acc_type_live:"Personal / Live", acc_type_demo:"Demo", acc_type_funded:"Akun Funded", acc_type_challenge:"Challenge / Evaluasi",
    acc_badge_live:"Live", acc_badge_demo:"Demo", acc_badge_funded:"Funded", acc_badge_challenge:"Challenge",
    acc_save:"Simpan akun", acc_create:"Buat akun", acc_delete:"Hapus akun",
    acc_name_required:"Nama akun wajib diisi.",
    acc_saved:"Akun disimpan.", acc_created:"Akun baru dibuat.", acc_deleted:"Akun dihapus.",
    acc_cannot_delete_last:"Minimal harus ada satu akun.", acc_switched:"Beralih ke akun: {name}",
    acc_delete_title:"Hapus akun ini?", acc_delete_msg:"Akun beserta semua trade di dalamnya akan dihapus permanen.",
    acc_open_dash:"Buka dashboard lengkap", acc_add_trade:"Tambah trade", acc_no_trades:"Belum ada trade di akun ini.",
    acc_start_balance:"Saldo awal", acc_return:"Return", acc_wins:"Trade profit", acc_losses:"Trade loss"
  },
  en: {
    lbl_currency:"Default currency for new accounts",
    acc_title:"Journal Accounts", acc_sub:"Manage multiple trading journals from one place",
    acc_add:"Add journal account", acc_active:"Active", acc_manage:"Manage account",
    acc_equity:"Current equity", acc_netpl:"Net P&L", acc_no_broker:"No broker set",
    acc_root:"My Journal Accounts", acc_new_title:"New journal account",
    acc_tab_dashboard:"Dashboard", acc_tab_trades:"Trades", acc_tab_stats:"Statistics", acc_tab_settings:"Settings",
    acc_chip_broker:"Broker", acc_chip_platform:"Platform", acc_chip_currency:"Currency",
    acc_settings_title:"Account Settings", acc_settings_sub:"Manage account details without changing global app preferences.",
    acc_basic:"Basic information", acc_f_name:"Account name", acc_f_broker:"Broker / Prop Firm", acc_f_broker_ph:"Enter broker name",
    acc_f_platform:"Platform", acc_f_type:"Account type", acc_f_currency:"Currency", acc_f_balance:"Starting balance",
    acc_type_live:"Personal / Live", acc_type_demo:"Demo", acc_type_funded:"Funded Account", acc_type_challenge:"Challenge / Evaluation",
    acc_badge_live:"Live", acc_badge_demo:"Demo", acc_badge_funded:"Funded", acc_badge_challenge:"Challenge",
    acc_save:"Save account", acc_create:"Create account", acc_delete:"Delete account",
    acc_name_required:"Account name is required.",
    acc_saved:"Account saved.", acc_created:"New account created.", acc_deleted:"Account deleted.",
    acc_cannot_delete_last:"You need at least one account.", acc_switched:"Switched to: {name}",
    acc_delete_title:"Delete this account?", acc_delete_msg:"The account and all its trades will be permanently deleted.",
    acc_open_dash:"Open full dashboard", acc_add_trade:"Add trade", acc_no_trades:"No trades in this account yet.",
    acc_start_balance:"Starting balance", acc_return:"Return", acc_wins:"Winning trades", acc_losses:"Losing trades"
  }
};
/* Gabungkan teks multi-akun ke kamus utama */
Object.keys(ACC_I18N).forEach(l => Object.assign(I18N[l], ACC_I18N[l]));

/* Teks fitur Add Trade Basic/Pro (ID + EN; bahasa lain fallback ke English) */
const PRO_I18N = {
  id: {
    add_sub:"Pilih mode sesuai kebutuhan: cepat catat (Basic) atau jurnal lengkap (Pro)",
    mode_basic:"Basic", mode_basic_sub:"Catat cepat, 30 detik", mode_pro:"Pro", mode_pro_sub:"Jurnal lengkap & analisis",
    sec_info:"Info trade", sec_exec:"Eksekusi", sec_playbook:"Playbook & konfirmasi", sec_emotion:"Emosi & psikologi", sec_perf:"Performa & catatan",
    lbl_symbol:"Symbol *", lbl_entry_short:"Entry *", lbl_close:"Close *", lbl_asset:"Aset", lbl_ttype:"Tipe trade",
    lbl_session:"Sesi", lbl_session_basic:"Sesi trading", lbl_plan:"Sesuai trading plan?",
    lbl_size:"Size / lot", lbl_pnl:"P&L *", lbl_tin:"Waktu entry", lbl_tout:"Waktu close",
    lbl_rr_manual:"R:R (isi manual)", lbl_rr_plan:"Planned R:R (otomatis)", lbl_rr_real:"Realized R:R (otomatis)",
    hint_rr:"Dihitung dari Entry, SL, TP, dan Exit. Tidak perlu isi manual.",
    lbl_exitreason:"Alasan exit", lbl_quality:"Kualitas setup", lbl_psych:"Kondisi psikologi saat trade",
    lbl_setup:"Setup / strategi", lbl_confirm:"Konfirmasi entry",
    lbl_emo_pos:"Positif — apa yang bikin kamu disiplin?", lbl_emo_neg:"Negatif — apa yang merusak trade ini?",
    lbl_grade:"Grade trade", lbl_notes:"Catatan", ph_notes:"Apa yang kamu pelajari dari trade ini?", lbl_screenshot:"Screenshot",
    dropzone_text:"Tarik screenshot ke sini, klik untuk unggah, atau tempel dengan Ctrl/Cmd+V",
    hint_cal_a:"Trade ini masuk ke kalender tanggal", hint_cal_b:"dan dihitung di P&L harian.",
    opt_long:"↑ Long", opt_short:"↓ Short",
    q_A:"Sempurna", q_B:"Bagus", q_C:"Biasa", q_D:"Asal masuk",
    o_komoditas:"Komoditas", o_indeks:"Indeks", o_saham:"Saham", o_nosession:"Tanpa sesi", o_yes:"Ya", o_no:"Tidak",
    o_calm:"Tenang", o_disciplined:"Disiplin", o_confident:"Percaya diri", o_fear:"Takut", o_greedy:"Serakah",
    o_tp:"TP kena", o_sl:"SL kena", o_be:"Break even", o_manual:"Close manual", o_trail:"Trailing stop", o_reverse:"Takut balik arah",
    o_htf:"Searah trend HTF", o_bos:"Break of structure", o_retest:"Retest level", o_candle:"Candle konfirmasi", o_news:"Aman dari news",
    o_patient:"Sabar tunggu setup", o_plan:"Ikuti plan", o_risk:"Risk terjaga", o_overtrade:"Overtrading", o_movesl:"Geser SL",
    kv_mode:"Mode", kv_asset:"Aset", kv_ttype:"Tipe", kv_session:"Sesi", kv_plan:"Sesuai plan", kv_time:"Waktu",
    kv_exitreason:"Alasan exit", kv_rr_real:"Realized R:R", kv_quality:"Kualitas setup", kv_grade:"Grade", kv_psych:"Psikologi",
    nt_setup:"Setup", nt_confirm:"Konfirmasi", nt_pos:"Emosi positif", nt_neg:"Emosi negatif", nt_psych:"Kondisi psikologi",
    toast_storage_full:"Penyimpanan browser penuh. Hapus beberapa screenshot atau export data dulu."
  },
  en: {
    add_sub:"Pick a mode: quick log (Basic) or a full journal (Pro)",
    mode_basic:"Basic", mode_basic_sub:"Quick log, 30 seconds", mode_pro:"Pro", mode_pro_sub:"Full journal & analysis",
    sec_info:"Trade info", sec_exec:"Execution", sec_playbook:"Playbook & confirmations", sec_emotion:"Emotion & psychology", sec_perf:"Performance & notes",
    lbl_symbol:"Symbol *", lbl_entry_short:"Entry *", lbl_close:"Close *", lbl_asset:"Asset", lbl_ttype:"Trade type",
    lbl_session:"Session", lbl_session_basic:"Trading session", lbl_plan:"Followed trading plan?",
    lbl_size:"Size / lot", lbl_pnl:"P&L *", lbl_tin:"Entry time", lbl_tout:"Close time",
    lbl_rr_manual:"R:R (enter manually)", lbl_rr_plan:"Planned R:R (auto)", lbl_rr_real:"Realized R:R (auto)",
    hint_rr:"Calculated from Entry, SL, TP, and Exit. No need to fill in manually.",
    lbl_exitreason:"Exit reason", lbl_quality:"Setup quality", lbl_psych:"Mindset during the trade",
    lbl_setup:"Setup / strategy", lbl_confirm:"Entry confirmations",
    lbl_emo_pos:"Positive — what kept you disciplined?", lbl_emo_neg:"Negative — what hurt this trade?",
    lbl_grade:"Trade grade", lbl_notes:"Notes", ph_notes:"What did you learn from this trade?", lbl_screenshot:"Screenshot",
    dropzone_text:"Drag a screenshot here, click to upload, or paste with Ctrl/Cmd+V",
    hint_cal_a:"This trade lands on the calendar date", hint_cal_b:"and counts toward daily P&L.",
    opt_long:"↑ Long", opt_short:"↓ Short",
    q_A:"Perfect", q_B:"Good", q_C:"Average", q_D:"Random entry",
    o_komoditas:"Commodities", o_indeks:"Indices", o_saham:"Stocks", o_nosession:"No session", o_yes:"Yes", o_no:"No",
    o_calm:"Calm", o_disciplined:"Disciplined", o_confident:"Confident", o_fear:"Fear", o_greedy:"Greedy",
    o_tp:"TP hit", o_sl:"SL hit", o_be:"Break even", o_manual:"Manual close", o_trail:"Trailing stop", o_reverse:"Feared reversal",
    o_htf:"With HTF trend", o_bos:"Break of structure", o_retest:"Level retest", o_candle:"Confirmation candle", o_news:"No news risk",
    o_patient:"Patient for setup", o_plan:"Followed plan", o_risk:"Risk managed", o_overtrade:"Overtrading", o_movesl:"Moved SL",
    kv_mode:"Mode", kv_asset:"Asset", kv_ttype:"Type", kv_session:"Session", kv_plan:"Followed plan", kv_time:"Time",
    kv_exitreason:"Exit reason", kv_rr_real:"Realized R:R", kv_quality:"Setup quality", kv_grade:"Grade", kv_psych:"Mindset",
    nt_setup:"Setup", nt_confirm:"Confirmations", nt_pos:"Positive emotions", nt_neg:"Negative emotions", nt_psych:"Mindset",
    toast_storage_full:"Browser storage is full. Remove some screenshots or export your data first."
  }
};
Object.keys(PRO_I18N).forEach(l => Object.assign(I18N[l], PRO_I18N[l]));

/* Teks fitur Strategy */
const STRAT_I18N = {
  id: {
    nav_strategy:"Strategy", strat_title:"Strategy",
    strat_sub:"Kumpulan setup dari journal kamu — otomatis update saat trade ditambah, diedit, atau dihapus",
    strat_search_ph:"Cari pair, sesi, atau setup...", filter_buy:"Buy", filter_sell:"Sell",
    strat_empty:"Belum ada setup yang cocok. Tambah trade dulu, nanti otomatis muncul di sini.",
    strat_no_img:"Belum ada screenshot", strat_setup:"Setup"
  },
  en: {
    nav_strategy:"Strategy", strat_title:"Strategy",
    strat_sub:"Your setups from the journal — updates automatically when trades are added, edited, or deleted",
    strat_search_ph:"Search pair, session, or setup...", filter_buy:"Buy", filter_sell:"Sell",
    strat_empty:"No matching setups yet. Add a trade and it will show up here automatically.",
    strat_no_img:"No screenshot yet", strat_setup:"Setup"
  }
};
Object.keys(STRAT_I18N).forEach(l => Object.assign(I18N[l], STRAT_I18N[l]));

/* Kutipan motivasi di sertifikat (beda untuk profit & loss) */
const CERT_QUOTES = {
  win: {
    id: [
      ['Konsistensi kecil ini yang membentuk <span>trader hebat</span>.', 'Profit bukan akhir dari usaha — evaluasi tetap jalan, disiplin tetap dijaga.'],
      ['Disiplin ini yang bikin hasil <span>layak dihormati</span>.', 'Pertahankan proses yang sama, hasil baik akan mengikuti dengan sendirinya.'],
      ['Rencana matang, eksekusi rapi, hasil <span>berbicara sendiri</span>.', 'Simpan momen ini sebagai standar buat trade-trade berikutnya.']
    ],
    en: [
      ['This kind of consistency is what builds <span>great traders</span>.', 'A win is not the finish line — keep reviewing, keep the discipline.'],
      ['This discipline is what makes a result <span>worth respecting</span>.', 'Keep the same process and good results will keep following.'],
      ['Solid plan, clean execution, results that <span>speak for themselves</span>.', 'Keep this moment as the benchmark for your next trades.']
    ]
  },
  loss: {
    id: [
      ['Rugi ini bagian dari proses, <span>bukan akhir cerita</span>.', 'Catat pelajarannya, jaga manajemen risiko, dan lanjutkan dengan kepala dingin.'],
      ['Setiap trader hebat pernah di titik ini — <span>lanjutkan saja</span>.', 'Evaluasi setup, bukan menyalahkan diri. Risk sudah terjaga, itu yang utama.'],
      ['Bukan kekalahan, ini <span>biaya belajar</span> yang wajar.', 'Selama SL dijaga dan pelajarannya dicatat, akun kamu tetap aman untuk lanjut.']
    ],
    en: [
      ['This loss is part of the process, <span>not the end of the story</span>.', 'Write down the lesson, protect your risk, and keep a clear head.'],
      ['Every great trader has been here — <span>just keep going</span>.', 'Review the setup, not yourself. Risk was managed, and that is what matters most.'],
      ['Not a defeat, just a normal <span>cost of learning</span>.', 'As long as your stop held and the lesson is logged, your account is fine to continue.']
    ]
  }
};
function tQuotes(kind){
  const lang = (CERT_QUOTES[kind][settings.language]) ? settings.language : 'en';
  return CERT_QUOTES[kind][lang];
}

/* t('kunci') = ambil teks sesuai bahasa aktif (fallback ke English, lalu ke kunci itu sendiri) */
function t(key){
  const lang = I18N[settings.language] ? settings.language : 'en';
  return (I18N[lang] && I18N[lang][key]) || (I18N.en && I18N.en[key]) || key;
}

/* Terapkan terjemahan ke semua elemen HTML yang punya data-i18n / data-i18n-ph */
function applyI18n(){
  document.documentElement.lang = settings.language;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.getAttribute('data-i18n-ph')); });
  document.getElementById('addPageTitle').textContent = editingId ? t('add_title_edit') : t('add_title_new');
}


/* =========================================================
   2. SUMBER DATA — settings, akun, trade (semua trade punya accountId)
   Semua data disimpan di localStorage browser (tidak ada server).
   ========================================================= */
const STORAGE_KEY = 'fxj_trades';
const SETTINGS_KEY = 'fxj_settings';
const ACCOUNTS_KEY = 'fxj_accounts';
const ACTIVE_KEY = 'fxj_active_account';

/* Deteksi bahasa browser; kalau tidak didukung pakai English */
function detectLang(){
  const supported = ['id','en','es','fr','pt','de'];
  const nav = ((navigator.language || 'en').slice(0,2)).toLowerCase();
  return supported.includes(nav) ? nav : 'en';
}
function loadSettings(){
  let s;
  try { s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null'); } catch(e){ s = null; }
  const defaults = { username:'trader_id', currency:'USD', language: detectLang(), theme:'dark' };
  return Object.assign({}, defaults, s || {});
}
function loadTrades(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch(e){ return []; }
}
function saveTrades(list){
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
  catch(e){ console.error(e); showToast(t('toast_storage_full'), 'error'); }
}

/* Akun bawaan kalau belum ada akun sama sekali */
function defaultAccount(){
  return { id:'acc_main', name:'Personal Trading', broker:'', platform:'MetaTrader 5', type:'live', currency:(settings && settings.currency) || 'USD', startBalance:0 };
}
function loadAccounts(){
  try {
    const a = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || 'null');
    if (Array.isArray(a) && a.length) return a;
  } catch(e){}
  return [defaultAccount()];
}
function saveAccounts(){
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  localStorage.setItem(ACTIVE_KEY, activeAccountId);
}

/* Variabel global (state aplikasi) */
let settings = loadSettings();
let accounts = loadAccounts();
let allTrades = loadTrades();                 // SEMUA trade dari semua akun
allTrades.forEach(x => { if (!x.accountId) x.accountId = accounts[0].id; });   // migrasi trade lama
let activeAccountId = localStorage.getItem(ACTIVE_KEY);
if (!accounts.some(a => a.id === activeAccountId)) activeAccountId = accounts[0].id;
let trades = [];                              // hanya trade milik akun AKTIF (dipakai semua halaman)
function syncTrades(){ trades = allTrades.filter(x => x.accountId === activeAccountId); }
syncTrades();
saveTrades(allTrades);
saveAccounts();

let activeTradeId = null;   // trade yang sedang dilihat di Detail
let editingId = null;       // jika sedang mengedit trade lama
let tempImages = [];        // gambar yang sedang diupload di form Tambah/Edit
let journalFilter = 'semua';
let journalSearchTerm = '';
let journalSort = { key:'date', dir:'desc' };
let accNew = false;         // halaman akun dalam mode "akun baru"
let accTab = 'dashboard';

function getAccount(id){ return accounts.find(a => a.id === id); }
function activeAccount(){ return getAccount(activeAccountId) || accounts[0]; }
function curCode(){ return (activeAccount() && activeAccount().currency) || settings.currency || 'USD'; }


/* =========================================================
   3. UTIL — fungsi bantu
   ========================================================= */

/* esc() = amankan teks sebelum dimasukkan ke HTML (cegah XSS) */
function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function localeForLang(lang){
  const map = {id:'id-ID', en:'en-US', es:'es-ES', fr:'fr-FR', pt:'pt-BR', de:'de-DE'};
  return map[lang] || 'en-US';
}
/* Format angka jadi mata uang, contoh: $1,234.50 */
function fmtCur(n, cur){
  try {
    return new Intl.NumberFormat(localeForLang(settings.language), { style:'currency', currency: cur || 'USD' }).format(n || 0);
  } catch(e){
    return (cur || '$') + ' ' + (n || 0).toFixed(2);
  }
}
/* Format uang dengan tanda +/-, contoh: +$185.00 atau -$42.00 */
function fmtMoney(n, cur){
  const sign = n < 0 ? '-' : '+';
  return sign + fmtCur(Math.abs(n || 0), cur || curCode());
}
function curSymbol(c){
  try {
    const p = new Intl.NumberFormat('en', { style:'currency', currency:c, currencyDisplay:'narrowSymbol' }).formatToParts(0).find(x => x.type === 'currency');
    return p ? p.value : c;
  } catch(e){ return c; }
}
function fmtDateShort(iso){
  const d = new Date(iso + 'T00:00:00');
  const locale = localeForLang(settings.language);
  return new Intl.DateTimeFormat(locale, { day:'numeric', month:'short' }).format(d);
}
/* Tanggal hari ini format YYYY-MM-DD */
function todayISO(){
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
/* Hitung R:R rencana = jarak reward (TP) dibagi jarak risk (SL) */
function computeRR(entry, sl, tp){
  entry = parseFloat(entry); sl = parseFloat(sl); tp = parseFloat(tp);
  if (isNaN(entry) || isNaN(sl) || isNaN(tp)) return null;
  const risk = Math.abs(entry - sl);
  const reward = Math.abs(tp - entry);
  if (risk === 0) return null;
  return reward / risk;
}
function rrLabel(rr){ return rr === null || rr === undefined ? '—' : ('1:' + rr.toFixed(1)); }
function dirLabel(arah){ return arah === 'Sell' ? t('opt_sell') : t('opt_buy'); }
function parseTags(str){ return (str || '').split(',').map(s => s.trim()).filter(Boolean); }


/* =========================================================
   4. TOAST + CONFIRM MODAL
   ========================================================= */

/* Tampilkan notifikasi kecil yang hilang sendiri setelah 3 detik */
function showToast(message, type){
  type = type || 'success';
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .3s ease';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 3000);
}
/* Tampilkan pop-up konfirmasi; onConfirm dijalankan kalau user klik "Ya" */
function showConfirm(titleKey, msgKey, onConfirm){
  document.getElementById('modalTitle').textContent = t(titleKey);
  document.getElementById('modalMsg').textContent = t(msgKey);
  document.getElementById('modalCancelBtn').textContent = t('modal_cancel');
  document.getElementById('modalConfirmBtn').textContent = t('modal_confirm');
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.add('active');
  const confirmBtn = document.getElementById('modalConfirmBtn');
  const cancelBtn = document.getElementById('modalCancelBtn');
  function cleanup(){
    overlay.classList.remove('active');
    confirmBtn.removeEventListener('click', onYes);
    cancelBtn.removeEventListener('click', onNo);
  }
  function onYes(){ cleanup(); onConfirm(); }
  function onNo(){ cleanup(); }
  confirmBtn.addEventListener('click', onYes);
  cancelBtn.addEventListener('click', onNo);
}


/* =========================================================
   5. NAVIGASI ANTAR SCREEN
   ========================================================= */
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => showScreen(item.dataset.screen));
});
/* Tampilkan satu halaman (screen) dan sembunyikan yang lain */
function showScreen(name){
  const navName = name === 'account' ? 'settings' : name;
  document.querySelectorAll('.nav-item').forEach(i => i.classList.toggle('active', i.dataset.screen === navName));
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  if (name === 'calendar') { renderPnlCalendar(); loadNews(false); }
  closeAccMenu();
  renderMobileMenu();   // <-- tambahan mobile
  window.scrollTo({ top:0, behavior:'auto' });
}


/* =========================================================
   6. ADD TRADE — MODE BASIC / PRO
   ========================================================= */
const MODE_KEY = 'fxj_form_mode';
const val = id => document.getElementById(id).value.trim();   // ambil nilai input (sudah di-trim)

/* Daftar pilihan chip untuk setiap grup */
const OPT_LISTS = {
  asset:['Forex','komoditas','indeks','Crypto','saham','Futures','Options'],
  ttype:['Scalp','Day trade','Swing'],
  sessionBasic:['Asia','London','New York'],
  sessionPro:['Asia','London','NY AM','NY PM','nosession'],
  plan:['yes','no'],
  exitReason:['tp','sl','be','manual','trail','reverse'],
  setup:['Breakout','Pullback','Reversal','Liquidity sweep','Order block','FVG'],
  confirm:['htf','bos','retest','candle','news'],
  emoPos:['calm','patient','plan','risk'],
  emoNeg:['FOMO','fear','greedy','Revenge','overtrade','movesl'],
  psych:['calm','disciplined','confident','FOMO','fear','greedy','Revenge'],
  grade:['A+','A','B','C','F']
};
/* Grup yang boleh pilih lebih dari satu */
const GROUP_MULTI = ['psych','setup','confirm','emoPos','emoNeg'];

function emptyChoices(){
  return { arah:'Buy', session:'', asset:'Forex', ttype:'', plan:'', quality:'', grade:'', exitReason:'',
           psych:[], setup:[], confirm:[], emoPos:[], emoNeg:[] };
}
let formMode = 'basic';
let choices = emptyChoices();   // pilihan chip yang sedang dipilih di form

/* Label opsi (pakai terjemahan bila ada, kalau tidak tampilkan nilai aslinya) */
function optLabel(v){ const k = 'o_' + v; const s = t(k); return s === k ? v : s; }
function chipsHtml(arr){ return (arr && arr.length) ? arr.map(v => `<span class="tag-badge">${esc(optLabel(v))}</span>`).join('') : ''; }

/* Bangun chip dari OPT_LISTS ke dalam elemen HTML yang punya data-list */
function buildChips(){
  document.querySelectorAll('#screen-add [data-list]').forEach(box => {
    const g = box.dataset.group;
    box.innerHTML = OPT_LISTS[box.dataset.list].map(v => {
      const k = 'o_' + v;
      const tr = I18N.en[k] ? ` data-i18n="${k}"` : '';
      return `<div class="opt${g === 'grade' ? ' opt-grade' : ''}" data-g="${g}" data-v="${esc(v)}"${tr}>${esc(v)}</div>`;
    }).join('');
  });
}
function isOn(g, v){ const c = choices[g]; return Array.isArray(c) ? c.includes(v) : c === v; }
/* Update tampilan chip aktif sesuai variabel choices */
function refreshChips(){
  document.querySelectorAll('#screen-add .opt').forEach(el => el.classList.toggle('active', isOn(el.dataset.g, el.dataset.v)));
}

/* Klik chip, header section, dan tombol mode (event delegation) */
document.getElementById('screen-add').addEventListener('click', e => {
  const opt = e.target.closest('.opt');
  if (opt) {
    const g = opt.dataset.g, v = opt.dataset.v;
    if (GROUP_MULTI.includes(g)) {
      const i = choices[g].indexOf(v);
      if (i >= 0) choices[g].splice(i, 1); else choices[g].push(v);
    } else if (g === 'arah') {
      choices.arah = v;
    } else {
      choices[g] = (choices[g] === v) ? '' : v;   // klik lagi = batal pilih
    }
    refreshChips();
    updatePreview();
    return;
  }
  const head = e.target.closest('.sec-head');
  if (head) { head.parentElement.classList.toggle('collapsed'); return; }
  const mb = e.target.closest('.mode-btn');
  if (mb) setMode(mb.dataset.mode);
});

/* Field yang dipakai bersama di kedua mode (nilai disalin saat ganti mode) */
const SHARED_FIELDS = [['b-date','p-date'], ['b-pair','p-pair'], ['b-entry','p-entry'], ['b-exit','p-exit'], ['b-hasil','p-hasil'], ['b-lot','p-lot'], ['b-alasan','p-alasan']];

function applyMode(mode){
  formMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  document.getElementById('mode-basic').classList.toggle('active', mode === 'basic');
  document.getElementById('mode-pro').classList.toggle('active', mode === 'pro');
  updatePreview();
  updateDateHint();
}
function setMode(mode){
  if (mode === formMode) return;
  const from = mode === 'pro' ? 0 : 1, to = 1 - from;
  SHARED_FIELDS.forEach(p => { document.getElementById(p[to]).value = document.getElementById(p[from]).value; });
  try { localStorage.setItem(MODE_KEY, mode); } catch(e){}
  applyMode(mode);
}

/* ---------- Perhitungan R:R ---------- */
function parseManualRR(s){
  s = (s || '').trim().replace(',', '.');
  if (!s) return null;
  const parts = s.split(':');
  const n = parseFloat(parts.length > 1 ? parts[1] : parts[0]);
  return (isNaN(n) || n < 0) ? null : n;
}
/* R:R realisasi = hasil sebenarnya dibagi risk (bisa negatif kalau rugi) */
function computeRealized(arah, entry, exit, sl){
  entry = parseFloat(entry); exit = parseFloat(exit); sl = parseFloat(sl);
  if (isNaN(entry) || isNaN(exit) || isNaN(sl)) return null;
  const risk = Math.abs(entry - sl);
  if (risk === 0) return null;
  return (arah === 'Sell' ? entry - exit : exit - entry) / risk;
}
function realizedLabel(r){ return (r === null || r === undefined) ? '—' : ((r >= 0 ? '+' : '') + r.toFixed(2) + 'R'); }
/* Update kotak R:R otomatis di mode Pro */
function updatePreview(){
  const planned = computeRR(val('p-entry'), val('p-sl'), val('p-tp'));
  const real = computeRealized(choices.arah, val('p-entry'), val('p-exit'), val('p-sl'));
  document.getElementById('p-rr-plan').textContent = rrLabel(planned);
  document.getElementById('p-rr-real').textContent = realizedLabel(real);
}
['p-entry','p-exit','p-sl','p-tp'].forEach(id => document.getElementById(id).addEventListener('input', updatePreview));

/* Petunjuk "trade ini masuk ke kalender tanggal ..." */
function updateDateHint(){
  const iso = val('p-date') || todayISO();
  const txt = new Intl.DateTimeFormat(localeForLang(settings.language), { weekday:'short', day:'numeric', month:'short' }).format(new Date(iso + 'T00:00:00'));
  document.getElementById('dateHint').innerHTML = esc(t('hint_cal_a')) + ' <b>' + esc(txt) + '</b> ' + esc(t('hint_cal_b'));
}
['b-date','p-date'].forEach(id => document.getElementById(id).addEventListener('change', updateDateHint));

/* ---------- Upload gambar (drag & drop, klik, paste Ctrl/Cmd+V) + kompres ---------- */
const dzPairs = [['dropzone','f-images'], ['b-dropzone','b-f-images']];
dzPairs.forEach(([dzId, inId]) => {
  const dz = document.getElementById(dzId), inp = document.getElementById(inId);
  dz.addEventListener('click', () => inp.click());
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.style.borderColor = 'var(--text-1)'; });
  dz.addEventListener('dragleave', () => { dz.style.borderColor = 'var(--line)'; });
  dz.addEventListener('drop', e => {
    e.preventDefault(); dz.style.borderColor = 'var(--line)';
    handleFiles(e.dataTransfer.files);
  });
  inp.addEventListener('change', () => handleFiles(inp.files));
});

/* Tempel gambar dari clipboard (hanya saat halaman Tambah trade aktif) */
document.addEventListener('paste', e => {
  if (!document.getElementById('screen-add').classList.contains('active') ) return;
  const items = (e.clipboardData && e.clipboardData.items) ? Array.from(e.clipboardData.items) : [];
  const files = items.filter(it => it.kind === 'file' && it.type.startsWith('image/')).map(it => it.getAsFile());
  if (files.length) { e.preventDefault(); handleFiles(files); }
});

/* Kompres gambar (maks 1280px, JPEG 80%) supaya localStorage tidak cepat penuh */
function compressImage(file, cb){
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const r = Math.min(1, 1280 / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      cb(c.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => cb(reader.result);
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}
function handleFiles(fileList){
  Array.from(fileList).forEach(file => {
    if (!file || !file.type.startsWith('image/')) return;
    compressImage(file, data => { tempImages.push(data); renderImgPreview(); });
  });
  dzPairs.forEach(([, inId]) => { document.getElementById(inId).value = ''; });
}
/* Tampilkan preview gambar yang diupload (dengan tombol hapus ×) */
function renderImgPreview(){
  ['imgPreviewGrid','b-imgPreviewGrid'].forEach(gid => {
    const grid = document.getElementById(gid);
    grid.innerHTML = tempImages.map((src, i) => `
      <div class="img-preview">
        <img src="${src}">
        <div class="rm" data-idx="${i}">&times;</div>
      </div>`).join('');
    grid.querySelectorAll('.rm').forEach(rm => {
      rm.addEventListener('click', () => {
        tempImages.splice(parseInt(rm.dataset.idx), 1);
        renderImgPreview();
      });
    });
  });
}

/* ---------- Reset form / isi form (edit) / simpan ---------- */
const FORM_TEXT_IDS = ['b-lot','b-alasan','b-pair','b-entry','b-exit','b-rr','b-hasil','p-pair','p-entry','p-exit','p-sl','p-tp','p-lot','p-hasil','p-tin','p-tout','p-tags','p-alasan','p-emosi','p-catatan'];

/* Kosongkan semua isian form dan kembali ke kondisi awal */
function resetForm(){
  FORM_TEXT_IDS.forEach(id => document.getElementById(id).value = '');
  document.getElementById('b-date').value = todayISO();
  document.getElementById('p-date').value = todayISO();
  choices = emptyChoices();
  tempImages = [];
  renderImgPreview();
  editingId = null;
  document.getElementById('formMsg').textContent = '';
  document.getElementById('addPageTitle').textContent = t('add_title_new');
  document.querySelectorAll('#screen-add .sec').forEach(s => s.classList.toggle('collapsed', s.id === 'secPlaybook'));
  let last = 'basic';
  try { last = localStorage.getItem(MODE_KEY) || 'basic'; } catch(e){}
  applyMode(last === 'pro' ? 'pro' : 'basic');
  refreshChips();
}

/* Isi form dengan data trade lama (dipakai saat Edit) */
function fillForm(t2){
  const set = (id, v) => { document.getElementById(id).value = (v === null || v === undefined) ? '' : v; };
  ['b','p'].forEach(p => {
    set(p + '-date', t2.date); set(p + '-pair', t2.pair); set(p + '-entry', t2.entry);
    set(p + '-exit', t2.exit); set(p + '-hasil', t2.hasil);
    set(p + '-lot', t2.lot); set(p + '-alasan', t2.alasan);
  });
  set('b-rr', (t2.rr !== null && t2.rr !== undefined) ? '1:' + Number(Number(t2.rr).toFixed(2)) : '');
  set('p-sl', t2.sl); set('p-tp', t2.tp); set('p-lot', t2.lot);
  set('p-tin', t2.tin); set('p-tout', t2.tout);
  set('p-tags', (t2.tags || []).join(', '));
  set('p-alasan', t2.alasan); set('p-emosi', t2.emosi); set('p-catatan', t2.catatan);
  choices = Object.assign(emptyChoices(), {
    arah: t2.arah || 'Buy', session: t2.session || '', asset: t2.asset || 'Forex', ttype: t2.ttype || '',
    plan: t2.plan || '', quality: t2.quality || '', grade: t2.grade || '', exitReason: t2.exitReason || '',
    psych: (t2.psych || []).slice(), setup: (t2.setup || []).slice(), confirm: (t2.confirm || []).slice(),
    emoPos: (t2.emoPos || []).slice(), emoNeg: (t2.emoNeg || []).slice()
  });
  tempImages = (t2.images || []).slice();
  renderImgPreview();
  const hasPlaybook = choices.setup.length || choices.confirm.length || t2.alasan || (t2.tags && t2.tags.length);
  document.getElementById('secPlaybook').classList.toggle('collapsed', !hasPlaybook);
  applyMode(t2.mode || 'pro');
  refreshChips();
}

document.getElementById('cancelAddBtn').addEventListener('click', () => {
  resetForm();
  showScreen('journal');
});

/* Tombol Simpan trade: validasi → buat objek trade → simpan ke localStorage */
document.getElementById('saveTradeBtn').addEventListener('click', () => {
  const pro = formMode === 'pro';
  const p = pro ? 'p-' : 'b-';
  const pair = val(p + 'pair').toUpperCase();
  const entry = val(p + 'entry'), exit = val(p + 'exit');
  const hasilRaw = val(p + 'hasil').replace(',', '.');

  // Validasi field wajib
  if (!pair || !entry || !exit || hasilRaw === '' || isNaN(parseFloat(hasilRaw))) {
    document.getElementById('formMsg').textContent = t('msg_required');
    return;
  }

  const sl = val('p-sl'), tp = val('p-tp');
  const arah = choices.arah;
  let rr = computeRR(entry, sl, tp);
  if (!pro) { const m = parseManualRR(val('b-rr')); if (m !== null) rr = m; }
  const rrReal = computeRealized(arah, entry, exit, sl);
  const existing = editingId ? allTrades.find(t2 => t2.id === editingId) : null;

  // Objek trade yang akan disimpan
  const tradeObj = {
    id: editingId || Date.now().toString(),
    accountId: existing ? existing.accountId : activeAccountId,
    mode: formMode,
    date: val(p + 'date') || (existing ? existing.date : todayISO()),
    pair, arah, entry, exit, sl, tp,
    lot: val(p + 'lot'),
    hasil: parseFloat(hasilRaw),
    rr, rrReal,
    asset: choices.asset, ttype: choices.ttype, session: choices.session, plan: choices.plan,
    tin: val('p-tin'), tout: val('p-tout'), exitReason: choices.exitReason,
    setup: choices.setup.slice(), confirm: choices.confirm.slice(),
    emoPos: choices.emoPos.slice(), emoNeg: choices.emoNeg.slice(), psych: choices.psych.slice(),
    quality: choices.quality, grade: choices.grade,
    tags: parseTags(val('p-tags')),
    alasan: val(p + 'alasan'), emosi: val('p-emosi'), catatan: val('p-catatan'),
    images: tempImages.slice()
  };

  if (editingId) {
    const idx = allTrades.findIndex(t2 => t2.id === editingId);
    allTrades[idx] = tradeObj;
  } else {
    allTrades.push(tradeObj);
  }
  saveTrades(allTrades);
  syncTrades();

  activeTradeId = tradeObj.id;
  resetForm();
  renderAll();
  showToast(t('toast_saved'), 'success');
  showScreen('detail');
});


/* =========================================================
   7. RENDER — JOURNAL
   ========================================================= */
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    journalFilter = chip.dataset.filter;
    renderJournal();
  });
});
document.getElementById('journalSearch').addEventListener('input', (e) => {
  journalSearchTerm = e.target.value.trim().toLowerCase();
  renderJournal();
});
/* Klik header tabel (Tanggal/Hasil) untuk mengurutkan */
document.querySelectorAll('th.sortable').forEach(th => {
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    if (journalSort.key === key) { journalSort.dir = journalSort.dir === 'asc' ? 'desc' : 'asc'; }
    else { journalSort = { key, dir: 'desc' }; }
    renderJournal();
  });
});

function sortedTrades(){
  const list = [...trades];
  const key = journalSort.key, dir = journalSort.dir === 'asc' ? 1 : -1;
  list.sort((a,b) => {
    if (key === 'hasil') return (a.hasil - b.hasil) * dir;
    if (a.date !== b.date) return (a.date < b.date ? -1 : 1) * dir;
    return (parseInt(a.id) - parseInt(b.id)) * dir;
  });
  return list;
}

function updateSortIndicators(){
  document.querySelectorAll('th.sortable').forEach(th => {
    const base = t(th.dataset.sort === 'date' ? 'th_date' : 'th_result');
    if (th.dataset.sort === journalSort.key) {
      th.textContent = base + ' ' + (journalSort.dir === 'asc' ? '▲' : '▼');
    } else {
      th.textContent = base;
    }
  });
}

function renderJournal(){
  const body = document.getElementById('journalBody');
  const empty = document.getElementById('journalEmpty');
  let list = sortedTrades();
  if (journalFilter === 'profit') list = list.filter(t2 => t2.hasil >= 0);
  if (journalFilter === 'loss') list = list.filter(t2 => t2.hasil < 0);
  if (journalSearchTerm) {
    list = list.filter(t2 => {
      const hay = [t2.pair, t2.alasan, t2.catatan, t2.session, t2.asset, t2.grade, ...(t2.tags||[]), ...(t2.setup||[])].join(' ').toLowerCase();
      return hay.includes(journalSearchTerm);
    });
  }
  updateSortIndicators();

  if (list.length === 0) {
    body.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  body.innerHTML = list.map(t2 => `
    <tr class="data-row" data-id="${t2.id}">
      <td>${fmtDateShort(t2.date)}</td>
      <td class="num-mono">${esc(t2.pair)}</td>
      <td><span class="badge ${t2.arah.toLowerCase()}">${dirLabel(t2.arah)}</span></td>
      <td class="num-mono">${esc(t2.entry)}</td>
      <td class="num-mono">${esc(t2.exit)}</td>
      <td class="num-mono">${rrLabel(t2.rr)}</td>
      <td class="${t2.hasil >= 0 ? 'pl-pos' : 'pl-neg'}">${fmtMoney(t2.hasil)}</td>
    </tr>`).join('');
  body.querySelectorAll('tr.data-row').forEach(row => {
    row.addEventListener('click', () => {
      activeTradeId = row.dataset.id;
      renderDetail();
      showScreen('detail');
    });
  });
}


/* =========================================================
   8. RENDER — DASHBOARD
   ========================================================= */

/* Hitung semua statistik dari daftar trade: win rate, profit factor, drawdown, dll */
function computeStats(list){
  list = list || trades;
  const wins = list.filter(t2 => t2.hasil >= 0);
  const losses = list.filter(t2 => t2.hasil < 0);
  const totalPL = list.reduce((s,t2) => s + t2.hasil, 0);
  const winRate = list.length ? Math.round((wins.length / list.length) * 100) : 0;
  const rrValues = list.map(t2 => t2.rr).filter(v => v !== null && v !== undefined);
  const avgRR = rrValues.length ? (rrValues.reduce((a,b)=>a+b,0) / rrValues.length) : 0;
  const grossProfit = wins.reduce((s,t2) => s + t2.hasil, 0);
  const grossLoss = Math.abs(losses.reduce((s,t2) => s + t2.hasil, 0));
  let profitFactor = null;
  if (grossLoss > 0) profitFactor = grossProfit / grossLoss;
  else if (grossProfit > 0) profitFactor = Infinity;
  const best = list.length ? Math.max(...list.map(t2 => t2.hasil)) : 0;
  const worst = list.length ? Math.min(...list.map(t2 => t2.hasil)) : 0;

  // Urutkan kronologis untuk menghitung max drawdown
  const chrono = [...list].sort((a,b) => a.date < b.date ? -1 : a.date > b.date ? 1 : parseInt(a.id) - parseInt(b.id));
  let cum = 0, peak = 0, maxDD = 0;
  chrono.forEach(t2 => { cum += t2.hasil; if (cum > peak) peak = cum; const dd = peak - cum; if (dd > maxDD) maxDD = dd; });

  return { totalPL, winRate, avgRR, profitFactor, best, worst, maxDD, chrono, winCount: wins.length, lossCount: losses.length, count: list.length };
}

function renderDashboard(){
  const stats = computeStats();

  const mTotal = document.getElementById('mTotalPL');
  mTotal.textContent = fmtMoney(stats.totalPL);
  mTotal.className = 'metric-value ' + (stats.totalPL >= 0 ? 'pos' : 'neg');
  document.getElementById('mWinRate').textContent = stats.winRate + '%';
  document.getElementById('mAvgRR').textContent = '1:' + stats.avgRR.toFixed(1);
  document.getElementById('mTotalTrades').textContent = trades.length;

  const pf = document.getElementById('mProfitFactor');
  if (stats.profitFactor === null) pf.textContent = '—';
  else if (stats.profitFactor === Infinity) pf.textContent = '∞';
  else pf.textContent = stats.profitFactor.toFixed(2) + 'x';

  document.getElementById('mBestTrade').textContent = fmtMoney(stats.best);
  document.getElementById('mWorstTrade').textContent = fmtMoney(stats.worst);
  document.getElementById('mMaxDD').textContent = fmtMoney(-Math.abs(stats.maxDD));

  // Equity curve (kronologis, kumulatif) digambar sebagai garis SVG
  const chrono = stats.chrono;
  const svg = document.getElementById('equitySvg');
  if (chrono.length === 0) {
    svg.innerHTML = `<text x="10" y="65" fill="#657176" font-size="12">${t('empty_data')}</text>`;
  } else {
    let cum = 0;
    const points = chrono.map(t2 => (cum += t2.hasil));
    const min = Math.min(0, ...points), max = Math.max(0, ...points);
    const range = (max - min) || 1;
    const w = 400, h = 130, pad = 8;
    const step = points.length > 1 ? (w - pad*2) / (points.length - 1) : 0;
    const coords = points.map((v,i) => {
      const x = pad + step * i;
      const y = h - pad - ((v - min) / range) * (h - pad*2);
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
    svg.innerHTML = `<polyline points="${coords}" fill="none" style="stroke:var(--text-1)" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
  }

  // Performa per pair (bar horizontal hijau/merah)
  const byPair = {};
  trades.forEach(t2 => { byPair[t2.pair] = (byPair[t2.pair] || 0) + t2.hasil; });
  const pairEl = document.getElementById('pairPerf');
  const pairNames = Object.keys(byPair);
  if (pairNames.length === 0) {
    pairEl.innerHTML = `<div class="empty-note">${t('empty_data')}</div>`;
  } else {
    const maxAbs = Math.max(...pairNames.map(p => Math.abs(byPair[p]))) || 1;
    pairEl.innerHTML = pairNames.map(p => {
      const v = byPair[p];
      const widthPct = Math.max(6, Math.round((Math.abs(v) / maxAbs) * 100));
      const color = v >= 0 ? '#4CAF7D' : '#D9534F';
      return `<div class="pair-row">
        <span class="pair-name">${esc(p)}</span>
        <div class="pair-bar-bg"><div class="pair-bar" style="width:${widthPct}%; background:${color}"></div></div>
        <span class="pair-val">${fmtMoney(v)}</span>
      </div>`;
    }).join('');
  }

  // Trade terbaru (3 teratas)
  const recent = [...trades].sort((a,b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : parseInt(b.id) - parseInt(a.id))).slice(0, 3);
  const recentBody = document.getElementById('recentTradesBody');
  const recentEmpty = document.getElementById('recentEmpty');
  if (recent.length === 0) {
    recentBody.innerHTML = '';
    recentEmpty.style.display = 'block';
  } else {
    recentEmpty.style.display = 'none';
    recentBody.innerHTML = recent.map(t2 => `
      <tr>
        <td>${fmtDateShort(t2.date)}</td>
        <td class="num-mono">${esc(t2.pair)}</td>
        <td><span class="badge ${t2.arah.toLowerCase()}">${dirLabel(t2.arah)}</span></td>
        <td class="num-mono">${rrLabel(t2.rr)}</td>
        <td class="${t2.hasil >= 0 ? 'pl-pos' : 'pl-neg'}">${fmtMoney(t2.hasil)}</td>
      </tr>`).join('');
  }
}


/* =========================================================
   9. RENDER — DETAIL TRADE
   ========================================================= */
function renderDetail(){
  const content = document.getElementById('detailContent');
  const empty = document.getElementById('detailEmpty');
  const trade = trades.find(t2 => t2.id === activeTradeId);

  if (!trade) {
    content.style.display = 'none';
    empty.style.display = 'block';
    document.getElementById('detailTitle').textContent = t('detail_title_default');
    document.getElementById('detailSub').textContent = t('detail_sub_default');
    return;
  }
  content.style.display = 'grid';
  empty.style.display = 'none';

  document.getElementById('detailTitle').textContent = trade.pair + ' — ' + t('detail_title_default');
  document.getElementById('detailSub').textContent = trade.pair + ' · ' + fmtDateShort(trade.date);

  // Screenshot utama + thumbnail (klik thumbnail untuk ganti gambar utama)
  const imgBox = document.getElementById('detailImgBox');
  const thumbs = document.getElementById('detailThumbs');
  if (trade.images && trade.images.length) {
    imgBox.innerHTML = `<img src="${trade.images[0]}">`;
    thumbs.innerHTML = trade.images.map(src => `<img src="${src}">`).join('');
    thumbs.querySelectorAll('img').forEach(img => {
      img.addEventListener('click', () => { imgBox.innerHTML = `<img src="${img.src}">`; });
    });
  } else {
    imgBox.innerHTML = `<i class="ti ti-photo" style="font-size:30px"></i>${t('img_empty')}`;
    thumbs.innerHTML = '';
  }

  // Blok catatan: alasan, setup, konfirmasi, psikologi, emosi
  const emptyNote = `<span style="color:var(--text-3)">${t('note_empty')}</span>`;
  const sec = (label, html) => html ? `<b style="margin-top:12px;">${label}</b><div style="margin-top:2px;">${html}</div>` : '';

  const noteParts = [`<b>${t('note_reason')}</b>${esc(trade.alasan) || emptyNote}`];
  noteParts.push(sec(t('nt_setup'), chipsHtml(trade.setup)));
  noteParts.push(sec(t('nt_confirm'), chipsHtml(trade.confirm)));
  noteParts.push(sec(t('nt_psych'), chipsHtml(trade.psych)));
  noteParts.push(sec(t('nt_pos'), chipsHtml(trade.emoPos)));
  noteParts.push(sec(t('nt_neg'), chipsHtml(trade.emoNeg)));
  noteParts.push(`<b style="margin-top:12px;">${t('note_emotion')}</b>${esc(trade.emosi) || emptyNote}`);
  if (trade.catatan) noteParts.push(`<b style="margin-top:12px;">${t('lbl_notes')}</b>${esc(trade.catatan)}`);
  document.getElementById('detailNote').innerHTML = noteParts.join('');

  // Tabel data trade (kolom kanan)
  const tagsHtml = (trade.tags && trade.tags.length) ? trade.tags.map(tg => `<span class="tag-badge">${esc(tg)}</span>`).join('') : '—';
  const row = (label, html) => html ? `<div class="kv-row"><span>${label}</span><span>${html}</span></div>` : '';
  const timeTxt = (trade.tin || trade.tout) ? ((trade.tin || '—') + ' → ' + (trade.tout || '—')) : '';
  const qualityTxt = trade.quality ? (trade.quality + ' — ' + t('q_' + trade.quality)) : '';

  document.getElementById('detailKv').innerHTML = `
    ${row(t('kv_mode'), (trade.mode || 'pro') === 'pro' ? t('mode_pro') : t('mode_basic'))}
    <div class="kv-row"><span>${t('kv_pair')}</span><span>${esc(trade.pair)}</span></div>
    <div class="kv-row"><span>${t('kv_dir')}</span><span><span class="badge ${trade.arah.toLowerCase()}">${dirLabel(trade.arah)}</span></span></div>
    ${row(t('kv_asset'), trade.asset ? esc(optLabel(trade.asset)) : '')}
    ${row(t('kv_ttype'), trade.ttype ? esc(optLabel(trade.ttype)) : '')}
    ${row(t('kv_session'), trade.session ? esc(optLabel(trade.session)) : '')}
    ${row(t('kv_plan'), trade.plan ? esc(optLabel(trade.plan)) : '')}
    <div class="kv-row"><span>${t('kv_entry')}</span><span>${esc(trade.entry)}</span></div>
    <div class="kv-row"><span>${t('kv_exit')}</span><span>${esc(trade.exit)}</span></div>
    <div class="kv-row"><span>${t('kv_sl')}</span><span>${esc(trade.sl) || '—'}</span></div>
    <div class="kv-row"><span>${t('kv_tp')}</span><span>${esc(trade.tp) || '—'}</span></div>
    <div class="kv-row"><span>${t('kv_lot')}</span><span>${esc(trade.lot) || '—'}</span></div>
    ${row(t('kv_time'), esc(timeTxt))}
    <div class="kv-row"><span>${t('kv_rr')}</span><span>${rrLabel(trade.rr)}</span></div>
    ${row(t('kv_rr_real'), (trade.rrReal !== null && trade.rrReal !== undefined) ? realizedLabel(trade.rrReal) : '')}
    ${row(t('kv_exitreason'), trade.exitReason ? esc(optLabel(trade.exitReason)) : '')}
    ${row(t('kv_quality'), esc(qualityTxt))}
    ${row(t('kv_grade'), esc(trade.grade || ''))}
    <div class="kv-row"><span>${t('kv_result')}</span><span class="${trade.hasil >= 0 ? 'pl-pos' : 'pl-neg'}">${fmtMoney(trade.hasil)}</span></div>
    <div class="kv-row"><span>${t('kv_tags')}</span><span style="text-align:right;">${tagsHtml}</span></div>
  `;
}

/* Tombol Edit: isi form dengan data trade lalu buka halaman Tambah trade */
document.getElementById('editTradeBtn').addEventListener('click', () => {
  const trade = trades.find(t2 => t2.id === activeTradeId);
  if (!trade) return;
  resetForm();
  editingId = trade.id;
  document.getElementById('addPageTitle').textContent = t('add_title_edit') + ' — ' + trade.pair;
  fillForm(trade);
  showScreen('add');
});

/* Tombol Hapus: konfirmasi dulu, lalu hapus trade */
document.getElementById('deleteTradeBtn').addEventListener('click', () => {
  if (!activeTradeId) return;
  showConfirm('modal_delete_title', 'modal_delete_msg', () => {
    allTrades = allTrades.filter(t2 => t2.id !== activeTradeId);
    saveTrades(allTrades);
    syncTrades();
    activeTradeId = null;
    renderAll();
    showToast(t('toast_deleted'), 'success');
    showScreen('journal');
  });
});


/* =========================================================
   10. SERTIFIKAT TRADE
   Mengisi elemen #certCard lalu dipotret jadi PNG pakai html2canvas
   ========================================================= */

/* Pilih kutipan motivasi (konsisten untuk trade yang sama berdasarkan hash id) */
function certPickQuote(trade){
  const pool = tQuotes(trade.hasil >= 0 ? 'win' : 'loss');
  const hash = String(trade.id).split('').reduce((a,c) => a + c.charCodeAt(0), 0);
  return pool[hash % pool.length];
}

/* Nomor seri sertifikat, contoh: FXJ-2026-12345 */
function certSerialFor(trade){
  const d = new Date(trade.date + 'T00:00:00');
  return 'FXJ-' + d.getFullYear() + '-' + String(trade.id).slice(-5).padStart(5,'0');
}

function certDateLong(iso){
  const d = new Date(iso + 'T00:00:00');
  return new Intl.DateTimeFormat(localeForLang(settings.language), { day:'numeric', month:'long', year:'numeric' }).format(d);
}

/* Bangun garis grafik kecil (sparkline) dari entry → exit */
function certBuildSparkline(trade){
  const entry = parseFloat(trade.entry), exit = parseFloat(trade.exit);
  const sl = parseFloat(trade.sl), tp = parseFloat(trade.tp);
  const vals = [entry, exit, sl, tp].filter(v => !isNaN(v));
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = (max - min) || Math.abs(entry) * 0.01 || 1;
  const W = 300, H = 110, PAD = 14;
  const toY = v => H - PAD - ((v - min) / range) * (H - PAD*2);

  const yEntry = toY(entry), yExit = isNaN(exit) ? yEntry : toY(exit);
  const color = trade.hasil >= 0 ? '#4CAF7D' : '#D9534F';

  const hash = String(trade.id).split('').reduce((a,c) => a * 31 + c.charCodeAt(0), 7);

  const N = 9;
  const points = [];
  for (let i = 0; i < N; i++) {
    const frac = i / (N - 1);
    const x = PAD + frac * (W - PAD*2);
    const baseY = yEntry + (yExit - yEntry) * frac;
    const edgeDamp = Math.sin(Math.min(frac, 1 - frac) * Math.PI);
    const wiggle = Math.sin(frac * Math.PI * 2.4 + (hash % 100) / 10) * (H * 0.09) * edgeDamp;
    const y = Math.min(H - 6, Math.max(6, baseY + wiggle));
    points.push({ x, y });
  }
  points[0].y = yEntry;
  points[N-1].y = yExit;

  const path = points.map((p,i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(' ');

  return { path, color, points };
}

/* Isi semua teks & angka di sertifikat sesuai data trade */
function renderCertificate(trade){
  const isWin = trade.hasil >= 0;
  const card = document.getElementById('certCard');
  card.className = 'cert-card ' + (isWin ? 'win' : 'loss');

  document.getElementById('certSerialLabel').textContent = t('cert_serial_label');
  document.getElementById('certTraderLabel').textContent = t('cert_trader_label');
  document.getElementById('certTraderName').textContent = settings.username || 'Trader';
  document.getElementById('certEyebrow').textContent = t('cert_eyebrow');
  document.getElementById('certSubtitle').textContent = t('cert_subtitle');
  document.getElementById('certPnlLabel').textContent = t('cert_pnl_label');
  document.getElementById('certRRLabel').textContent = t('cert_rr_label');
  document.getElementById('certLotLabel').textContent = t('cert_lot_label');
  document.getElementById('certEntryLabel').textContent = t('cert_entry_label');
  document.getElementById('certExitLabel').textContent = t('cert_exit_label');
  document.getElementById('certDateLabel').textContent = t('cert_date_label');
  document.getElementById('certSlLabel').textContent = t('cert_sl_label');
  document.getElementById('certTpLabel').textContent = t('cert_tp_label');
  document.getElementById('certPairLabel').textContent = t('cert_pair_label');
  document.getElementById('certNoteLabel').textContent = t('cert_note_label');
  document.getElementById('certFootPrefix').textContent = t('cert_foot_prefix');
  document.getElementById('certSetupLabel').textContent = t('cert_setup_label');
  document.getElementById('certVerified').textContent = t('cert_verified');

  document.getElementById('certSerial').textContent = certSerialFor(trade);
  document.getElementById('certSerialDate').textContent = certDateLong(trade.date);
  document.getElementById('certPair').textContent = trade.pair;
  document.getElementById('certPairSmall').textContent = trade.pair;

  const dirBadge = document.getElementById('certDirBadge');
  dirBadge.textContent = dirLabel(trade.arah);
  dirBadge.style.background = trade.arah === 'Buy' ? '#17251D' : '#2A1919';
  dirBadge.style.color = trade.arah === 'Buy' ? '#4CAF7D' : '#D9534F';
  dirBadge.style.border = '1px solid ' + (trade.arah === 'Buy' ? 'rgba(76,175,125,0.35)' : 'rgba(217,83,79,0.35)');

  document.getElementById('certPnl').textContent = fmtMoney(trade.hasil);
  document.getElementById('certRR').textContent = rrLabel(trade.rr);
  document.getElementById('certLot').textContent = trade.lot || '—';
  document.getElementById('certEntry').textContent = trade.entry || '—';
  document.getElementById('certExit').textContent = trade.exit || '—';
  document.getElementById('certSl').textContent = trade.sl || '—';
  document.getElementById('certTp').textContent = trade.tp || '—';
  document.getElementById('certDate').textContent = fmtDateShort(trade.date) + ' ' + trade.date.slice(0,4);
  document.getElementById('certSetup').textContent = trade.alasan || (trade.setup || []).map(optLabel).join(', ') || t('cert_no_setup');

  const [quote, note] = certPickQuote(trade);
  document.getElementById('certQuote').innerHTML = quote;
  document.getElementById('certNote').textContent = note;

  const spark = certBuildSparkline(trade);
  document.getElementById('certSparkPath').setAttribute('d', spark.path);
  document.getElementById('certSparkPath').setAttribute('stroke', spark.color);
  const markersGroup = document.getElementById('certSparkMarkers');
  markersGroup.innerHTML = spark.points.map((p,i) => {
    const isEnd = i === spark.points.length - 1;
    const isStart = i === 0;
    const r = isEnd ? 5 : (isStart ? 4 : 2.6);
    const fill = isEnd ? spark.color : (isStart ? '#0A0A0A' : spark.color);
    const stroke = isStart ? '#A3A3A3' : 'none';
    const strokeAttr = isStart ? ` stroke="${stroke}" stroke-width="1.5"` : '';
    return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r}" fill="${fill}"${strokeAttr}/>`;
  }).join('');
}

/* Potret sertifikat dengan html2canvas lalu unduh sebagai file PNG */
function downloadCertificate(){
  const trade = trades.find(t2 => t2.id === activeTradeId);
  if (!trade) { showToast(t('toast_no_trade_selected'), 'error'); return; }
  if (typeof html2canvas === 'undefined') { showToast(t('toast_cert_error'), 'error'); return; }

  renderCertificate(trade);
  const certBtn = document.getElementById('certBtn');
  const originalLabel = certBtn.innerHTML;
  certBtn.innerHTML = `<i class="ti ti-loader-2"></i> ${t('toast_cert_making')}`;

  requestAnimationFrame(() => {
    setTimeout(() => {
      html2canvas(document.getElementById('certCard'), {
        backgroundColor: null,
        scale: 2,
        useCORS: true
      }).then(canvas => {
        canvas.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `sertifikat-${trade.pair}-${trade.date}.png`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          certBtn.innerHTML = originalLabel;
        });
      }).catch(err => {
        console.error(err);
        showToast(t('toast_cert_error'), 'error');
        certBtn.innerHTML = originalLabel;
      });
    }, 60);
  });
}

document.getElementById('certBtn').addEventListener('click', downloadCertificate);


/* =========================================================
   11. RENDER — KALENDER P/L
   ========================================================= */
const CAL_TXT = {
  id:{today:'Hari ini', monthly:'P/L Bulanan:', week:'Minggu', one:'trade', many:'trade'},
  en:{today:'Today', monthly:'Monthly P/L:', week:'Week', one:'trade', many:'trades'},
  es:{today:'Hoy', monthly:'P/L mensual:', week:'Semana', one:'operación', many:'operaciones'},
  fr:{today:"Aujourd'hui", monthly:'P/L mensuel :', week:'Semaine', one:'trade', many:'trades'},
  pt:{today:'Hoje', monthly:'P/L mensal:', week:'Semana', one:'trade', many:'trades'},
  de:{today:'Heute', monthly:'Monatlicher P/L:', week:'Woche', one:'Trade', many:'Trades'}
};
function ct(k){ return (CAL_TXT[settings.language] || CAL_TXT.en)[k]; }

let pnlCalDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);   // bulan yang ditampilkan
let calSelectedDate = null;                                                      // tanggal yang diklik

function isoOf(d){
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function calFmt(n){
  n = Math.round((n || 0) * 100) / 100;
  return (n < 0 ? '-' : '') + fmtCur(Math.abs(n), curCode());
}
function calColor(n){
  n = Math.round((n || 0) * 100) / 100;
  return n > 0 ? 'var(--green)' : n < 0 ? 'var(--red)' : 'var(--text-1)';
}
function calCountLabel(c){ return c + ' ' + (c === 1 ? ct('one') : ct('many')); }

/* Kelompokkan P&L dan jumlah trade per tanggal */
function buildDayStats(){
  const map = {};
  trades.forEach(t2 => {
    const m = map[t2.date] || (map[t2.date] = { pnl:0, count:0 });
    m.pnl += t2.hasil;
    m.count += 1;
  });
  return map;
}

/* Ganti bulan (dipanggil dari tombol panah di HTML: onclick) */
function pnlCalChangeMonth(delta){
  pnlCalDate = new Date(pnlCalDate.getFullYear(), pnlCalDate.getMonth() + delta, 1);
  calSelectedDate = null;
  renderPnlCalendar();
}
/* Kembali ke bulan ini (dipanggil dari tombol Today di HTML: onclick) */
function pnlCalToday(){
  const now = new Date();
  pnlCalDate = new Date(now.getFullYear(), now.getMonth(), 1);
  calSelectedDate = todayISO();
  renderPnlCalendar();
}

/* Daftar trade di bawah kalender saat sebuah tanggal diklik */
function renderCalDayDetail(){
  const box = document.getElementById('calDayDetail');
  const list = calSelectedDate ? trades.filter(t2 => t2.date === calSelectedDate) : [];
  if (list.length === 0) { box.innerHTML = ''; return; }
  const total = list.reduce((s, t2) => s + t2.hasil, 0);
  const longDate = new Intl.DateTimeFormat(localeForLang(settings.language), { weekday:'long', day:'numeric', month:'long', year:'numeric' }).format(new Date(calSelectedDate + 'T00:00:00'));
  box.innerHTML = `
    <div class="cal-day-detail">
      <div class="card-title">
        <span>${longDate}</span>
        <span class="num-mono" style="color:${calColor(total)}">${calFmt(total)}</span>
      </div>
      <div style="overflow-x:auto;">
      <table>
        <tbody>
          ${list.map(t2 => `
            <tr class="data-row" data-id="${t2.id}">
              <td class="num-mono">${esc(t2.pair)}</td>
              <td><span class="badge ${t2.arah.toLowerCase()}">${dirLabel(t2.arah)}</span></td>
              <td class="num-mono">${rrLabel(t2.rr)}</td>
              <td class="${t2.hasil >= 0 ? 'pl-pos' : 'pl-neg'}" style="text-align:right;">${fmtMoney(t2.hasil)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
      </div>
    </div>`;
  box.querySelectorAll('tr.data-row').forEach(row => {
    row.addEventListener('click', () => {
      activeTradeId = row.dataset.id;
      renderDetail();
      showScreen('detail');
    });
  });
}

/* Gambar grid kalender 6 baris x 7 kolom; kolom Sabtu = ringkasan mingguan */
function renderPnlCalendar(){
  const stats = buildDayStats();
  const year = pnlCalDate.getFullYear();
  const month = pnlCalDate.getMonth();
  const locale = localeForLang(settings.language);

  const label = new Intl.DateTimeFormat(locale, { month:'short', year:'numeric' }).format(new Date(year, month, 1));
  document.getElementById('pnlCalMonthLabel').textContent = label.charAt(0).toUpperCase() + label.slice(1);
  document.getElementById('calMonthlyLabel').textContent = ct('monthly');
  document.getElementById('calTodayBtn').textContent = ct('today');

  // Total P&L bulan ini
  const prefix = year + '-' + String(month + 1).padStart(2,'0') + '-';
  let monthPL = 0;
  Object.keys(stats).forEach(k => { if (k.startsWith(prefix)) monthPL += stats[k].pnl; });
  const plEl = document.getElementById('calMonthlyPL');
  plEl.textContent = calFmt(monthPL);
  plEl.style.color = calColor(monthPL);

  const grid = document.getElementById('pnlCalGrid');
  grid.innerHTML = '';

  // Header nama hari (Min–Sab) sesuai bahasa
  const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday:'short' });
  const refSunday = new Date(2023, 0, 1);
  for (let i = 0; i < 7; i++) {
    const d = new Date(refSunday.getFullYear(), refSunday.getMonth(), refSunday.getDate() + i);
    const el = document.createElement('div');
    el.className = 'cal-dow';
    el.textContent = weekdayFmt.format(d);
    grid.appendChild(el);
  }

  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  const todayStr = todayISO();
  let curWeek = 0, extraWeek = 0;

  for (let row = 0; row < 6; row++) {
    const rowDays = [];
    for (let c = 0; c < 7; c++) rowDays.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + row * 7 + c));

    const rowHasCurrent = rowDays.some(d => d.getMonth() === month);
    const weekNum = rowHasCurrent ? ++curWeek : ++extraWeek;

    // Hitung total P&L mingguan
    let weekPL = 0, weekCount = 0;
    rowDays.forEach(d => {
      if (rowHasCurrent && d.getMonth() !== month) return;
      const st = stats[isoOf(d)];
      if (st) { weekPL += st.pnl; weekCount += st.count; }
    });

    rowDays.forEach((d, c) => {
      const iso = isoOf(d);
      const inMonth = d.getMonth() === month;
      const isSat = c === 6;
      const st = stats[iso];
      const dimmed = isSat ? !rowHasCurrent : !inMonth;

      const cell = document.createElement('div');
      let cls = 'cal-cell';
      if (dimmed) cls += ' other';
      if (st) {
        cls += ' has';
        if (!isSat) cls += st.pnl >= 0 ? ' win' : ' loss';
      }
      if (iso === calSelectedDate) cls += ' selected';
      cell.className = cls;

      const dayNum = iso === todayStr ? `<span class="cal-today">${d.getDate()}</span>` : `<span>${d.getDate()}</span>`;
      let body = '';
      if (isSat) {
        body = `
          <div class="cal-week">${ct('week')} ${weekNum}</div>
          <div class="cal-pnl" style="color:${calColor(weekPL)}">${calFmt(weekPL)}</div>
          <div class="cal-count">${calCountLabel(weekCount)}</div>`;
      } else if (st) {
        body = `
          <div class="cal-pnl" style="color:${calColor(st.pnl)}">${calFmt(st.pnl)}</div>
          <div class="cal-count">${calCountLabel(st.count)}</div>`;
      }
      cell.innerHTML = `${dayNum}<div class="cal-body">${body}</div>`;

      if (st) {
        cell.addEventListener('click', () => {
          calSelectedDate = iso;
          renderPnlCalendar();
        });
      }
      grid.appendChild(cell);
    });
  }

  renderCalDayDetail();
}


/* =========================================================
   12. MULTI AKUN — statistik, switcher, kartu akun, halaman akun
   ========================================================= */

/* Statistik satu akun + equity (saldo awal + total P&L) */
function accStats(id){
  const a = getAccount(id) || { startBalance:0 };
  const list = allTrades.filter(x => x.accountId === id);
  const s = computeStats(list);
  s.equity = (parseFloat(a.startBalance) || 0) + s.totalPL;
  return s;
}
function accIcon(type){
  return { live:'ti-chart-bar', demo:'ti-flask', funded:'ti-shield-check', challenge:'ti-trophy' }[type] || 'ti-wallet';
}
function accTypeLabel(type){ return t('acc_type_' + type); }
function accBadgeLabel(type){ return t('acc_badge_' + type); }

function closeAccMenu(){ document.getElementById('accMenu').classList.remove('open'); }

/* Pindah ke akun lain: ganti akun aktif, muat ulang trade-nya, render ulang semua halaman */
function switchAccount(id, silent){
  if (!getAccount(id) || id === activeAccountId) { closeAccMenu(); return; }
  activeAccountId = id;
  saveAccounts();
  syncTrades();
  activeTradeId = null;
  calSelectedDate = null;
  resetForm();
  renderAll();
  closeAccMenu();
  if (!silent) showToast(t('acc_switched').replace('{name}', getAccount(id).name), 'success');
}

/* Render dropdown switcher akun di sidebar + select akun versi mobile + label akun aktif */
function renderAccSwitcher(){
  const a = activeAccount();
  const s = accStats(a.id);
  document.getElementById('accSwitchName').textContent = a.name;
  document.getElementById('accSwitchEq').textContent = fmtCur(s.equity, a.currency);

  const menu = document.getElementById('accMenu');
  menu.innerHTML = accounts.map(x => {
    const st = accStats(x.id);
    const on = x.id === activeAccountId;
    return `<div class="acc-menu-item ${on ? 'active' : ''}" data-id="${x.id}">
      <div class="n"><span>${esc(x.name)}</span><span>${on ? '✓' : ''}</span></div>
      <div class="e">${fmtCur(st.equity, x.currency)}</div>
    </div>`;
  }).join('') + `<div class="acc-menu-add" id="accMenuAdd">+ ${t('acc_add')}</div>`;
  menu.querySelectorAll('.acc-menu-item').forEach(it => {
    it.addEventListener('click', () => switchAccount(it.dataset.id));
  });
  document.getElementById('accMenuAdd').addEventListener('click', () => { closeAccMenu(); openAccountPage(null); });

  // Pilihan akun versi mobile (bar atas)
  const sel = document.getElementById('accMobileSelect');
  sel.innerHTML = accounts.map(x => `<option value="${x.id}" ${x.id === activeAccountId ? 'selected' : ''}>${esc(x.name)}</option>`).join('');

  // Label "akun aktif" di setiap halaman
  document.querySelectorAll('.screen:not(#screen-settings):not(#screen-account) .page-head').forEach(h => {
    let tag = h.querySelector('.acc-tag');
    if (!tag) { tag = document.createElement('div'); tag.className = 'acc-tag'; h.appendChild(tag); }
    tag.innerHTML = `<span class="dot"></span>${esc(a.name)}`;
  });
}

document.getElementById('accSwitchBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  document.getElementById('accMenu').classList.toggle('open');
});
document.addEventListener('click', (e) => { if (!e.target.closest('#accSwitch')) closeAccMenu(); });
document.getElementById('accMobileSelect').addEventListener('change', (e) => switchAccount(e.target.value));

/* Kartu daftar akun di halaman Pengaturan */
function renderAccountsGrid(){
  const grid = document.getElementById('accGrid');
  grid.innerHTML = accounts.map(a => {
    const s = accStats(a.id);
    const on = a.id === activeAccountId;
    return `<div class="acc-card ${on ? 'active' : ''}">
      <div class="acc-card-top">
        <div class="acc-icon ${a.type}"><i class="ti ${accIcon(a.type)}"></i></div>
        <div style="min-width:0;">
          <div class="acc-name">${esc(a.name)} ${on ? `<span class="acc-pill on">${t('acc_active')}</span>` : ''}</div>
          <div class="acc-meta">${esc(a.broker || t('acc_no_broker'))} · ${esc(a.platform)} · ${accTypeLabel(a.type)}</div>
        </div>
      </div>
      <div class="acc-card-bottom">
        <div class="acc-kv"><div class="l">${t('acc_equity')}</div><div class="v">${fmtCur(s.equity, a.currency)}</div></div>
        <div class="acc-sep"></div>
        <div class="acc-kv"><div class="l">${t('acc_netpl')}</div><div class="v ${s.totalPL >= 0 ? 'pl-pos' : 'pl-neg'}">${fmtMoney(s.totalPL, a.currency)}</div></div>
        <div class="btn btn-outline" data-manage="${a.id}"><i class="ti ti-settings"></i> ${t('acc_manage')}</div>
      </div>
    </div>`;
  }).join('');
  grid.querySelectorAll('[data-manage]').forEach(b => {
    b.addEventListener('click', () => {
      const id = b.dataset.manage;
      if (id !== activeAccountId) switchAccount(id, true);
      openAccountPage(id);
    });
  });
}

document.getElementById('addAccBtn').addEventListener('click', () => openAccountPage(null));

/* ---- Halaman akun (kelola / tambah akun) ---- */
function openAccountPage(id, tab){
  accNew = !id;   // id kosong = mode buat akun baru
  showScreen('account');
  renderAccountPage(tab || (accNew ? 'settings' : 'dashboard'));
}

function metricCard(label, v, cls){
  return `<div class="card"><div class="metric-label">${label}</div><div class="metric-value small ${cls || ''}">${v}</div></div>`;
}
function pfText(pf){
  if (pf === null) return '—';
  if (pf === Infinity) return '∞';
  return pf.toFixed(2) + 'x';
}

function renderAccountPage(tab){
  accTab = tab || accTab;
  const a = accNew ? null : activeAccount();

  // Header halaman akun
  document.getElementById('accHeroName').textContent = accNew ? t('acc_new_title') : a.name;
  document.getElementById('accHeroCrumb').textContent = t('acc_root') + ' / ' + (accNew ? t('acc_new_title') : a.name);
  const icon = document.getElementById('accHeroIcon');
  icon.className = 'acc-icon ' + (accNew ? '' : a.type);
  icon.innerHTML = `<i class="ti ${accNew ? 'ti-wallet' : accIcon(a.type)}"></i>`;
  const badge = document.getElementById('accHeroBadge');
  badge.style.display = accNew ? 'none' : '';
  if (!accNew) { badge.textContent = accBadgeLabel(a.type); badge.className = 'acc-pill' + (a.type === 'live' ? ' on' : ''); }
  document.getElementById('accHeroSettingsBtn').style.display = accNew ? 'none' : '';
  document.getElementById('accChips').innerHTML = accNew ? '' : `
    <div class="acc-chip"><span>${t('acc_chip_broker')}</span><b>${esc(a.broker || t('acc_no_broker'))}</b></div>
    <div class="acc-chip"><span>${t('acc_chip_platform')}</span><b>${esc(a.platform)}</b></div>
    <div class="acc-chip"><span>${t('acc_chip_currency')}</span><b>${esc(a.currency)} (${esc(curSymbol(a.currency))})</b></div>`;

  // Tab (mode akun baru hanya menampilkan tab Settings)
  if (accNew) accTab = 'settings';
  document.querySelectorAll('.acc-tab').forEach(b => {
    b.style.display = (accNew && b.dataset.acctab !== 'settings') ? 'none' : '';
    b.classList.toggle('active', b.dataset.acctab === accTab);
  });
  document.querySelectorAll('.acc-panel').forEach(p => p.classList.toggle('active', p.id === 'accpanel-' + accTab));

  if (!accNew) { renderAccDash(); renderAccTrades(); renderAccStats(); }
  fillAccountForm(a);
}

function renderAccDash(){
  const a = activeAccount(), s = accStats(a.id);
  const panel = document.getElementById('accpanel-dashboard');
  panel.innerHTML = `
    <div class="grid-4" style="margin-bottom:14px;">
      ${metricCard(t('acc_equity'), fmtCur(s.equity, a.currency))}
      ${metricCard(t('acc_netpl'), fmtMoney(s.totalPL, a.currency), s.totalPL >= 0 ? 'pos' : 'neg')}
      ${metricCard(t('m_win_rate'), s.winRate + '%')}
      ${metricCard(t('m_total_trades'), s.count)}
    </div>
    <div style="display:flex; gap:10px; flex-wrap:wrap;">
      <div class="btn btn-primary" id="accOpenDashBtn"><i class="ti ti-chart-bar"></i> ${t('acc_open_dash')}</div>
      <div class="btn btn-ghost" id="accAddTradeBtn"><i class="ti ti-plus"></i> ${t('acc_add_trade')}</div>
    </div>`;
  document.getElementById('accOpenDashBtn').addEventListener('click', () => showScreen('dashboard'));
  document.getElementById('accAddTradeBtn').addEventListener('click', () => { resetForm(); showScreen('add'); });
}

function renderAccTrades(){
  const panel = document.getElementById('accpanel-trades');
  const list = [...trades].sort((a,b) => a.date < b.date ? 1 : a.date > b.date ? -1 : parseInt(b.id) - parseInt(a.id));
  if (!list.length) { panel.innerHTML = `<div class="empty-note">${t('acc_no_trades')}</div>`; return; }
  panel.innerHTML = `<div style="overflow-x:auto;"><table class="wide-table">
    <tr><th>${t('th_date')}</th><th>${t('th_pair')}</th><th>${t('th_dir')}</th><th>${t('th_rr')}</th><th>${t('th_result')}</th></tr>
    <tbody>${list.map(t2 => `
      <tr class="data-row" data-id="${t2.id}">
        <td>${fmtDateShort(t2.date)}</td>
        <td class="num-mono">${esc(t2.pair)}</td>
        <td><span class="badge ${t2.arah.toLowerCase()}">${dirLabel(t2.arah)}</span></td>
        <td class="num-mono">${rrLabel(t2.rr)}</td>
        <td class="${t2.hasil >= 0 ? 'pl-pos' : 'pl-neg'}">${fmtMoney(t2.hasil)}</td>
      </tr>`).join('')}</tbody></table></div>`;
  panel.querySelectorAll('tr.data-row').forEach(row => {
    row.addEventListener('click', () => {
      activeTradeId = row.dataset.id;
      renderDetail();
      showScreen('detail');
    });
  });
}

function renderAccStats(){
  const a = activeAccount(), s = accStats(a.id);
  const start = parseFloat(a.startBalance) || 0;
  const ret = start > 0 ? ((s.totalPL / start) * 100).toFixed(2) + '%' : '—';
  document.getElementById('accpanel-stats').innerHTML = `
    <div class="grid-4" style="margin-bottom:14px;">
      ${metricCard(t('m_profit_factor'), pfText(s.profitFactor))}
      ${metricCard(t('m_best_trade'), fmtMoney(s.best, a.currency), 'pos')}
      ${metricCard(t('m_worst_trade'), fmtMoney(s.worst, a.currency), 'neg')}
      ${metricCard(t('m_max_dd'), fmtMoney(-Math.abs(s.maxDD), a.currency))}
    </div>
    <div class="grid-4">
      ${metricCard(t('m_avg_rr'), '1:' + s.avgRR.toFixed(1))}
      ${metricCard(t('acc_start_balance'), fmtCur(start, a.currency))}
      ${metricCard(t('acc_return'), ret, s.totalPL >= 0 ? 'pos' : 'neg')}
      ${metricCard(t('acc_wins') + ' / ' + t('acc_losses'), s.winCount + ' / ' + s.lossCount)}
    </div>`;
}

/* Isi form pengaturan akun (kosong kalau akun baru) */
function fillAccountForm(a){
  document.getElementById('a-name').value = a ? a.name : '';
  document.getElementById('a-broker').value = a ? a.broker : '';
  document.getElementById('a-platform').value = a ? a.platform : 'MetaTrader 5';
  document.getElementById('a-type').value = a ? a.type : 'live';
  document.getElementById('a-currency').value = a ? a.currency : (settings.currency || 'USD');
  document.getElementById('a-balance').value = a ? a.startBalance : '';
  document.getElementById('accFormMsg').textContent = '';
  document.getElementById('accSaveLabel').textContent = accNew ? t('acc_create') : t('acc_save');
  document.getElementById('accDeleteBtn').style.display = accNew ? 'none' : '';
}

document.querySelectorAll('.acc-tab').forEach(b => {
  b.addEventListener('click', () => renderAccountPage(b.dataset.acctab));
});
document.getElementById('accHeroSettingsBtn').addEventListener('click', () => renderAccountPage('settings'));

/* Simpan akun: buat baru atau update akun yang ada */
document.getElementById('accSaveBtn').addEventListener('click', () => {
  const name = document.getElementById('a-name').value.trim();
  if (!name) { document.getElementById('accFormMsg').textContent = t('acc_name_required'); return; }
  const bal = parseFloat(document.getElementById('a-balance').value);
  const data = {
    name,
    broker: document.getElementById('a-broker').value.trim(),
    platform: document.getElementById('a-platform').value,
    type: document.getElementById('a-type').value,
    currency: document.getElementById('a-currency').value,
    startBalance: isNaN(bal) ? 0 : bal
  };

  if (accNew) {
    const acc = Object.assign({ id: 'acc_' + Date.now() }, data);
    accounts.push(acc);
    activeAccountId = acc.id;
    saveAccounts();
    syncTrades();
    activeTradeId = null;
    calSelectedDate = null;
    resetForm();
    renderAll();
    showToast(t('acc_created'), 'success');
    openAccountPage(acc.id, 'dashboard');
  } else {
    Object.assign(activeAccount(), data);
    saveAccounts();
    renderAll();
    showToast(t('acc_saved'), 'success');
  }
});

/* Hapus akun (beserta semua trade-nya); minimal harus tersisa 1 akun */
document.getElementById('accDeleteBtn').addEventListener('click', () => {
  if (accounts.length <= 1) { showToast(t('acc_cannot_delete_last'), 'error'); return; }
  showConfirm('acc_delete_title', 'acc_delete_msg', () => {
    const id = activeAccountId;
    allTrades = allTrades.filter(x => x.accountId !== id);
    accounts = accounts.filter(x => x.id !== id);
    activeAccountId = accounts[0].id;
    saveTrades(allTrades);
    saveAccounts();
    syncTrades();
    activeTradeId = null;
    calSelectedDate = null;
    renderAll();
    showToast(t('acc_deleted'), 'success');
    showScreen('settings');
  });
});


/* =========================================================
   13. TEMA (gelap/terang) + BAHASA — kontrol cepat & pengaturan
   ========================================================= */
function applyTheme(){
  document.documentElement.setAttribute('data-theme', settings.theme);
  const icon = document.querySelector('#themeToggle i');
  icon.className = settings.theme === 'dark' ? 'ti ti-moon' : 'ti ti-sun';
}
/* Sinkronkan semua dropdown/input kontrol dengan nilai settings */
function syncControlsUI(){
  document.getElementById('langSelect').value = settings.language;
  document.getElementById('settingsLanguage').value = settings.language;
  document.getElementById('settingsTheme').value = settings.theme;
  document.getElementById('settingsUsername').value = settings.username;
  document.getElementById('settingsCurrency').value = settings.currency;
  document.getElementById('navUserLabel').textContent = settings.username;
  syncMobileHeader();   // <-- tambahan mobile
}
function persistSettings(){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }

document.getElementById('themeToggle').addEventListener('click', () => {
  settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
  persistSettings();
  applyTheme();
  syncControlsUI();
});
document.getElementById('langSelect').addEventListener('change', (e) => {
  settings.language = e.target.value;
  persistSettings();
  applyI18n();
  syncControlsUI();
  renderAll();
  updateDateHint();
});

document.getElementById('saveSettingsBtn').addEventListener('click', () => {
  settings.username = document.getElementById('settingsUsername').value.trim() || 'trader_id';
  settings.currency = document.getElementById('settingsCurrency').value;
  settings.language = document.getElementById('settingsLanguage').value;
  settings.theme = document.getElementById('settingsTheme').value;
  persistSettings();
  applyTheme();
  applyI18n();
  syncControlsUI();
  renderAll();
  updateDateHint();
  showToast(t('toast_settings_saved'), 'success');
});

/* Tombol "Reset data" di sidebar: hapus semua trade & akun, kembali ke awal */
document.getElementById('logoutBtn').addEventListener('click', () => {
  showConfirm('modal_reset_title', 'modal_reset_msg', () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACCOUNTS_KEY);
    localStorage.removeItem(ACTIVE_KEY);
    allTrades = [];
    accounts = [defaultAccount()];
    activeAccountId = accounts[0].id;
    saveAccounts();
    syncTrades();
    activeTradeId = null;
    renderAll();
    showToast(t('toast_reset_done'), 'success');
    showScreen('dashboard');
  });
});


/* =========================================================
   14. EXPORT / IMPORT DATA (semua akun + semua trade)
   ========================================================= */

/* Export: unduh semua data sebagai file JSON */
document.getElementById('exportBtn').addEventListener('click', () => {
  const payload = { exportedAt: new Date().toISOString(), trades: allTrades, accounts, activeAccountId, settings };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tradex-journal-backup-${todayISO()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast(t('toast_exported'), 'success');
});

/* Import: baca file JSON backup lalu pulihkan data */
document.getElementById('importBtn').addEventListener('click', () => {
  document.getElementById('importFile').click();
});
document.getElementById('importFile').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!parsed || !Array.isArray(parsed.trades)) throw new Error('invalid format');
      if (Array.isArray(parsed.accounts) && parsed.accounts.length) accounts = parsed.accounts;
      else accounts = [defaultAccount()];
      allTrades = parsed.trades;
      allTrades.forEach(x => { if (!x.accountId || !getAccount(x.accountId)) x.accountId = accounts[0].id; });
      activeAccountId = (parsed.activeAccountId && getAccount(parsed.activeAccountId)) ? parsed.activeAccountId : accounts[0].id;
      saveTrades(allTrades);
      saveAccounts();
      syncTrades();
      activeTradeId = null;
      if (parsed.settings) {
        settings = Object.assign({}, settings, parsed.settings);
        persistSettings();
        applyTheme();
        applyI18n();
        syncControlsUI();
      }
      renderAll();
      showToast(t('toast_imported'), 'success');
    } catch (err) {
      console.error(err);
      showToast(t('toast_import_error'), 'error');
    }
    e.target.value = '';
  };
  reader.readAsText(file);
});


/* =========================================================
   15. STRATEGY — kartu setup, data realtime dari journal
   ========================================================= */
let strategyFilter = 'semua';
let strategySearchTerm = '';

/* Label R (contoh +2.5R) untuk ditampilkan di kartu */
function stratR(t2){
  let r = null;
  if (t2.rrReal !== null && t2.rrReal !== undefined) r = t2.rrReal;
  else if (t2.hasil >= 0 && t2.rr) r = t2.rr;
  if (r === null) return null;
  const v = Math.round(r * 10) / 10;
  return (v >= 0 ? '+' : '') + v + 'R';
}

function renderStrategy(){
  const grid = document.getElementById('strategyGrid');
  const empty = document.getElementById('strategyEmpty');

  // Terbaru = Setup 01 (penomoran dihitung sebelum filter supaya nomor tetap konsisten)
  const sorted = [...trades].sort((a,b) => a.date < b.date ? 1 : a.date > b.date ? -1 : parseInt(b.id) - parseInt(a.id));
  let list = sorted.map((t2, i) => ({ t2, no: i + 1 }));

  if (strategyFilter !== 'semua') list = list.filter(x => x.t2.arah === strategyFilter);
  if (strategySearchTerm) {
    list = list.filter(x => {
      const t2 = x.t2;
      const hay = [t2.pair, t2.session, t2.asset, t2.alasan, ...(t2.tags||[]), ...(t2.setup||[]), ...(t2.confirm||[])].join(' ').toLowerCase();
      return hay.includes(strategySearchTerm);
    });
  }

  if (!list.length) { grid.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  grid.innerHTML = list.map(({ t2, no }) => {
    const hasImg = !!(t2.images && t2.images.length);
    const img = hasImg
      ? `<img src="${t2.images[0]}" alt="">`
      : `<i class="ti ti-photo"></i><span>${t('strat_no_img')}</span>`;
    const r = stratR(t2);
    const extra = [];
    if (t2.session) extra.push(optLabel(t2.session));
    (t2.setup || []).forEach(v => extra.push(optLabel(v)));
    (t2.tags || []).forEach(v => extra.push(v));
    const extraHtml = extra.slice(0, 3).map(v => `<span class="s-tag">${esc(v)}</span>`).join('');
    const rHtml = r ? `<span class="s-tag ${t2.hasil >= 0 ? 'r-win' : 'r-loss'}">${esc(r)}</span>` : '';
    return `
      <div class="strat-card" data-id="${t2.id}">
        <div class="strat-thumb${hasImg ? ' has-img' : ''}">${img}</div>
        <div class="strat-body">
          <div class="strat-title">${t('strat_setup')} ${String(no).padStart(2,'0')} · ${esc(t2.pair)}</div>
          <div class="strat-tags">
            <span class="s-tag ${t2.arah.toLowerCase()}">${dirLabel(t2.arah)}</span>
            ${extraHtml}${rHtml}
          </div>
          <div class="strat-meta">
            <span>${fmtDateShort(t2.date)} ${esc(t2.date.slice(0,4))}</span>
            <span class="${t2.hasil >= 0 ? 'pl-pos' : 'pl-neg'}">${fmtMoney(t2.hasil)}</span>
          </div>
        </div>
      </div>`;
  }).join('');

  grid.querySelectorAll('.strat-card').forEach(card => {
    // Klik bagian bawah kartu = buka halaman Detail trade
    card.addEventListener('click', () => {
      activeTradeId = card.dataset.id;
      renderDetail();
      showScreen('detail');
    });
    // Klik gambar = buka lightbox (gambar besar & jelas)
    const th = card.querySelector('.strat-thumb.has-img');
    if (th) th.addEventListener('click', e => {
      e.stopPropagation();
      openLightbox(card.dataset.id, 0);
    });
  });
}

document.querySelectorAll('.s-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.s-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    strategyFilter = chip.dataset.sfilter;
    renderStrategy();
  });
});
document.getElementById('strategySearch').addEventListener('input', e => {
  strategySearchTerm = e.target.value.trim().toLowerCase();
  renderStrategy();
});


/* =========================================================
   16. LIGHTBOX — lihat screenshot dengan jelas
   ========================================================= */
let lbImgs = [], lbIdx = 0, lbTradeId = null;

function lbRender(){
  const tr = allTrades.find(x => x.id === lbTradeId);
  document.getElementById('lbImg').src = lbImgs[lbIdx];
  document.getElementById('lbTitle').textContent = tr ? tr.pair + ' · ' + fmtDateShort(tr.date) + ' ' + tr.date.slice(0,4) : '';
  document.getElementById('lbCount').textContent = lbImgs.length > 1 ? (lbIdx + 1) + ' / ' + lbImgs.length : '';
  document.getElementById('lbPrev').classList.toggle('hide', lbImgs.length < 2);
  document.getElementById('lbNext').classList.toggle('hide', lbImgs.length < 2);
  lbSetZoom(false);
}
function lbSetZoom(on){
  const st = document.getElementById('lbStage');
  st.classList.toggle('zoom', on);
  st.scrollTo(0, 0);
  document.getElementById('lbZoomBtn').innerHTML = on ? '<i class="ti ti-zoom-out"></i> Fit' : '<i class="ti ti-zoom-in"></i> Zoom';
}
function openLightbox(tradeId, idx){
  const tr = allTrades.find(x => x.id === tradeId);
  if (!tr || !tr.images || !tr.images.length) return;
  lbTradeId = tradeId; lbImgs = tr.images; lbIdx = idx || 0;
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
  lbRender();
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}
function lbStep(d){
  if (lbImgs.length < 2) return;
  lbIdx = (lbIdx + d + lbImgs.length) % lbImgs.length;
  lbRender();
}

document.getElementById('lbCloseBtn').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', e => { e.stopPropagation(); lbStep(-1); });
document.getElementById('lbNext').addEventListener('click', e => { e.stopPropagation(); lbStep(1); });
document.getElementById('lbZoomBtn').addEventListener('click', () => lbSetZoom(!document.getElementById('lbStage').classList.contains('zoom')));
document.getElementById('lbImg').addEventListener('click', () => lbSetZoom(!document.getElementById('lbStage').classList.contains('zoom')));
document.getElementById('lbDetailBtn').addEventListener('click', () => {
  activeTradeId = lbTradeId;
  closeLightbox();
  renderDetail();
  showScreen('detail');
});
document.getElementById('lbStage').addEventListener('click', e => {
  if (e.target.id === 'lbStage') closeLightbox();   // klik area gelap = tutup
});
/* Keyboard: Esc = tutup, panah kiri/kanan = ganti gambar */
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lbStep(-1);
  if (e.key === 'ArrowRight') lbStep(1);
});


/* =========================================================
   17. MOBILE HEADER + MENU
   ========================================================= */
const M_MENU = [
  ['dashboard','nav_dashboard'], ['journal','nav_journal'], ['strategy','nav_strategy'],
  ['add','nav_add'], ['detail','nav_detail'], ['calendar','nav_calendar'], ['settings','nav_settings']
];

/* Bangun daftar menu burger + dropdown akun versi HP */
function renderMobileMenu(){
  const cur = (document.querySelector('.nav-item.active') || {}).dataset;
  const curScreen = cur ? cur.screen : 'dashboard';
  document.getElementById('mMenuList').innerHTML = M_MENU.map(([s,k]) =>
    `<div class="m-item ${s === curScreen ? 'on' : ''}" data-s="${s}">${t(k)}</div>`
  ).join('');
  document.querySelectorAll('#mMenuList .m-item').forEach(it => {
    it.addEventListener('click', () => { closeMobileMenu(); showScreen(it.dataset.s); });
  });

  const sel = document.getElementById('mAccSelect');
  sel.innerHTML = accounts.map(x => `<option value="${x.id}" ${x.id === activeAccountId ? 'selected' : ''}>${esc(x.name)}</option>`).join('');
}

function closeMobileMenu(){
  document.getElementById('mMenu').classList.remove('open');
  const b = document.getElementById('mBurger');
  b.classList.remove('open');
  b.innerHTML = '<i class="ti ti-menu-2"></i>';
}

/* Sinkronkan tombol bahasa (ID/EN) & ikon tema di header HP */
function syncMobileHeader(){
  document.querySelectorAll('.m-lang button').forEach(b => b.classList.toggle('active', b.dataset.lang === settings.language));
  document.getElementById('mTheme').innerHTML = settings.theme === 'dark' ? '<i class="ti ti-moon"></i>' : '<i class="ti ti-sun"></i>';
}

document.getElementById('mBurger').addEventListener('click', () => {
  const menu = document.getElementById('mMenu');
  const b = document.getElementById('mBurger');
  const open = !menu.classList.contains('open');
  menu.classList.toggle('open', open);
  b.classList.toggle('open', open);
  b.innerHTML = open ? '<i class="ti ti-x"></i>' : '<i class="ti ti-menu-2"></i>';
});
document.getElementById('mTheme').addEventListener('click', () => document.getElementById('themeToggle').click());
document.querySelectorAll('.m-lang button').forEach(b => {
  b.addEventListener('click', () => {
    settings.language = b.dataset.lang;
    persistSettings();
    applyI18n();
    syncControlsUI();
    renderAll();
    updateDateHint();
  });
});
document.getElementById('mAccSelect').addEventListener('change', e => { switchAccount(e.target.value); closeMobileMenu(); });


/* =========================================================
   18. KALENDER NEWS — data dari feed mingguan Forex Factory
   ========================================================= */
const NEWS_I18N = {
  id: {
    news_title:"Kalender News", news_all:"Semua", news_high:"High", news_medium:"Medium", news_low:"Low",
    news_all_cur:"Semua mata uang", news_loading:"Memuat data news...",
    news_error:"Gagal memuat data news. Coba refresh sebentar lagi.",
    news_empty:"Tidak ada news yang cocok dengan filter ini.",
    news_forecast:"Forecast", news_previous:"Previous", news_event:"Event", news_time:"Jam",
    news_updated:"Update", news_today:"Hari ini", news_stale:"(data lama)"
  },
  en: {
    news_title:"News calendar", news_all:"All", news_high:"High", news_medium:"Medium", news_low:"Low",
    news_all_cur:"All currencies", news_loading:"Loading news data...",
    news_error:"Couldn't load news data. Please try refreshing in a moment.",
    news_empty:"No news match this filter.",
    news_forecast:"Forecast", news_previous:"Previous", news_event:"Event", news_time:"Time",
    news_updated:"Updated", news_today:"Today", news_stale:"(cached)"
  }
};
Object.keys(NEWS_I18N).forEach(l => Object.assign(I18N[l], NEWS_I18N[l]));

const NEWS_URL = 'https://nfs.faireconomy.media/ff_calendar_thisweek.json';
/* Daftar jalur ambil data: langsung dulu, kalau gagal lewat proxy CORS */
const NEWS_PROXIES = [
  u => u,
  u => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u),
  u => 'https://corsproxy.io/?' + encodeURIComponent(u)
];
const NEWS_CACHE_KEY = 'fxj_news_cache';
const NEWS_TTL = 30 * 60 * 1000;   // 30 menit (FF membatasi request)

let newsData = [], newsFetchedAt = 0, newsStale = false;
let newsImpact = 'all', newsCur = 'all', newsLoading = false, newsError = false;

function newsReadCache(){
  try {
    const c = JSON.parse(localStorage.getItem(NEWS_CACHE_KEY) || 'null');
    if (c && Array.isArray(c.data)) return c;
  } catch(e){}
  return null;
}

/* Ambil data news: pakai cache kalau masih baru, kalau tidak fetch dari internet */
async function loadNews(force){
  if (newsLoading) return;
  const cache = newsReadCache();
  if (!force && cache && Date.now() - cache.at < NEWS_TTL) {
    newsData = cache.data; newsFetchedAt = cache.at; newsStale = false; newsError = false;
    renderNews();
    return;
  }
  newsLoading = true; newsError = false;
  renderNews();

  let result = null;
  for (const wrap of NEWS_PROXIES) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(wrap(NEWS_URL), { signal: ctrl.signal, cache:'no-store' });
      clearTimeout(timer);
      if (!res.ok) continue;
      const json = await res.json();
      if (Array.isArray(json) && json.length) { result = json; break; }
    } catch(e){ /* coba proxy berikutnya */ }
  }

  if (result) {
    newsData = result; newsFetchedAt = Date.now(); newsStale = false;
    try { localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify({ at:newsFetchedAt, data:result })); } catch(e){}
  } else if (cache) {
    newsData = cache.data; newsFetchedAt = cache.at; newsStale = true;   // pakai data lama
  } else {
    newsError = true;
  }
  newsLoading = false;
  renderNews();
}

/* Tampilkan daftar news per hari, sesuai filter impact & mata uang */
function renderNews(){
  const body = document.getElementById('newsBody');
  if (!body) return;

  // Dropdown mata uang
  const sel = document.getElementById('newsCurSelect');
  const curs = [...new Set(newsData.map(e => e.country).filter(Boolean))].sort();
  sel.innerHTML = `<option value="all">${esc(t('news_all_cur'))}</option>` +
    curs.map(c => `<option value="${esc(c)}" ${c === newsCur ? 'selected' : ''}>${esc(c)}</option>`).join('');
  if (newsCur !== 'all' && !curs.includes(newsCur)) newsCur = 'all';
  sel.value = newsCur;

  // Label waktu update
  const upd = document.getElementById('newsUpdated');
  if (newsFetchedAt) {
    const tm = new Intl.DateTimeFormat(localeForLang(settings.language), { hour:'2-digit', minute:'2-digit' }).format(new Date(newsFetchedAt));
    upd.textContent = t('news_updated') + ' ' + tm + (newsStale ? ' ' + t('news_stale') : '');
  } else upd.textContent = '';
  document.getElementById('newsRefreshBtn').firstElementChild.className = 'ti ' + (newsLoading ? 'ti-loader-2' : 'ti-refresh');

  if (newsLoading && !newsData.length) { body.innerHTML = `<div class="empty-note">${t('news_loading')}</div>`; return; }
  if (newsError) { body.innerHTML = `<div class="empty-note">${t('news_error')}</div>`; return; }

  let list = newsData.map(e => ({ ...e, ts: new Date(e.date).getTime() })).filter(e => !isNaN(e.ts));
  if (newsImpact !== 'all') list = list.filter(e => e.impact === newsImpact);
  if (newsCur !== 'all') list = list.filter(e => e.country === newsCur);
  list.sort((a,b) => a.ts - b.ts);

  if (!list.length) { body.innerHTML = `<div class="empty-note">${t('news_empty')}</div>`; return; }

  const locale = localeForLang(settings.language);
  const timeFmt = new Intl.DateTimeFormat(locale, { hour:'2-digit', minute:'2-digit', hour12:false });
  const dayFmt  = new Intl.DateTimeFormat(locale, { weekday:'long', day:'numeric', month:'long' });
  const todayKey = todayISO();
  const now = Date.now();

  // Kelompokkan news per hari
  const groups = {};
  list.forEach(e => { (groups[isoOf(new Date(e.ts))] = groups[isoOf(new Date(e.ts))] || []).push(e); });

  body.innerHTML = Object.keys(groups).sort().map(key => {
    const items = groups[key];
    const isToday = key === todayKey;
    const rows = items.map(e => {
      const imp = ['High','Medium','Low'].includes(e.impact) ? e.impact : 'Holiday';
      const isHoliday = imp === 'Holiday';
      return `<tr class="news-row ${e.ts < now ? 'past' : ''}">
        <td class="news-time">${isHoliday ? '—' : timeFmt.format(new Date(e.ts))}</td>
        <td class="news-cur">${esc(e.country)}</td>
        <td><i class="imp-dot imp-${imp}" title="${esc(e.impact)}"></i></td>
        <td class="news-title">${esc(e.title)}</td>
        <td class="num-mono">${esc(e.forecast || '—')}</td>
        <td class="num-mono">${esc(e.previous || '—')}</td>
      </tr>`;
    }).join('');
    return `<div class="news-day ${isToday ? 'today' : ''}">
        <span>${esc(dayFmt.format(new Date(items[0].ts)))}</span>
        <small>${isToday ? esc(t('news_today')) : ''}</small>
      </div>
      <table class="wide-table">
        <tr><th>${t('news_time')}</th><th></th><th></th><th>${t('news_event')}</th><th>${t('news_forecast')}</th><th>${t('news_previous')}</th></tr>
        <tbody>${rows}</tbody>
      </table>`;
  }).join('');
}

document.getElementById('newsImpactChips').addEventListener('click', e => {
  const c = e.target.closest('.n-chip');
  if (!c) return;
  document.querySelectorAll('#newsImpactChips .n-chip').forEach(x => x.classList.toggle('active', x === c));
  newsImpact = c.dataset.impact;
  renderNews();
});
document.getElementById('newsCurSelect').addEventListener('change', e => { newsCur = e.target.value; renderNews(); });
document.getElementById('newsRefreshBtn').addEventListener('click', () => loadNews(true));


/* =========================================================
   19. INIT — render semua screen dari data yang tersimpan
   ========================================================= */

/* renderAll() = gambar ulang SEMUA halaman. Dipanggil setiap data berubah */
function renderAll(){
  renderAccSwitcher();
  renderAccountsGrid();
  renderDashboard();
  renderJournal();
  renderStrategy();
  renderDetail();
  renderPnlCalendar();
  renderNews();
  if (document.getElementById('screen-account').classList.contains('active') && !accNew) renderAccountPage(accTab);
  renderMobileMenu();   // <-- tambahan mobile
}

/* Urutan menjalankan saat halaman pertama kali dibuka */
buildChips();      // bangun chip pilihan di form Tambah trade
resetForm();       // kosongkan form
applyTheme();      // terapkan tema gelap/terang
applyI18n();       // terapkan bahasa
syncControlsUI();  // sinkronkan dropdown pengaturan
renderAll();       // gambar semua halaman
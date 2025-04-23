import {
  AddNumbersData,
  AddNumbersError,
  AnalyzeInvoicesData,
  AnalyzeInvoicesError,
  AnalyzeWithClaudeData,
  AnalyzeWithClaudeError,
  AppApisCommunicationSendReportEmailRequest,
  AppApisReportActionsSendReportEmailRequest,
  BodyStartComparisonUpload,
  BodyUploadInvoices,
  BuildServiceCalendarData,
  BuildServiceCalendarError,
  BuildServiceCalendarRequest,
  BulkExtractInvoiceDataData,
  BulkExtractInvoiceDataError,
  BulkInvoiceRequest,
  CalculatorRequest,
  CheckHealthData,
  CheckProcessingStatusData,
  CheckProcessingStatusError,
  ClaudeRequest,
  CompareContractsData,
  CompareContractsError,
  CompareContractsRequest,
  ContractDataInput,
  CreateInvoiceExtractionTaskData,
  CreateInvoiceExtractionTaskError,
  DivideNumbersData,
  DivideNumbersError,
  ExtractInvoiceDataData,
  ExtractInvoiceDataError,
  ExtractInvoiceRequest,
  GenerateContractComparisonReportData,
  GenerateContractComparisonReportError,
  GenerateContractComparisonReportParams,
  GetComparisonDetailsData,
  GetComparisonDetailsError,
  GetComparisonDetailsParams,
  GetComparisonHistory2Data,
  GetComparisonHistory2Error,
  GetComparisonHistory2Params,
  GetComparisonHistoryData,
  GetComparisonHistoryError,
  GetComparisonHistoryParams,
  GetDashboardSummaryData,
  GetInvoiceLineItemsData,
  GetInvoiceLineItemsError,
  GetInvoiceLineItemsParams,
  GetInvoiceSummariesData,
  InvoiceAnalysisRequest,
  MCPRequest,
  McpListToolsData,
  McpQueryData,
  McpQueryError,
  McpQueryStreamData,
  McpQueryStreamError,
  MultiplyNumbersData,
  MultiplyNumbersError,
  NormalizeInvoiceItemsData,
  NormalizeInvoiceItemsError,
  NormalizeInvoiceItemsRequest,
  PowerNumbersData,
  PowerNumbersError,
  ProcessingStatusRequest,
  RedFlagScannerData,
  RedFlagScannerError,
  SendEmailRequest,
  SendPlainEmailData,
  SendPlainEmailError,
  SendReportLinkEmailData,
  SendReportLinkEmailError,
  SendReportPdfEmailData,
  SendReportPdfEmailError,
  StartComparisonUploadData,
  StartComparisonUploadError,
  StoreComparisonRequest,
  StoreComparisonResultData,
  StoreComparisonResultError,
  SubtractNumbersData,
  SubtractNumbersError,
  SummarizeContractData,
  SummarizeContractError,
  SummarizeContractRequest,
  UploadInvoicesData,
  UploadInvoicesError,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description List available tools in the MCP server running locally.
   *
   * @tags dbtn/module:chat
   * @name mcp_list_tools
   * @summary Mcp List Tools
   * @request GET:/routes/chat/tools
   */
  mcp_list_tools = (params: RequestParams = {}) =>
    this.request<McpListToolsData, any>({
      path: `/routes/chat/tools`,
      method: "GET",
      ...params,
    });

  /**
   * @description Query the app's MCP server running locally. This endpoint creates a connection to a local MCP server running on the URL specified by the INTERNAL_MCP_SSE_URL environment variable (defaults to localhost:9000/internal/sse) and runs an agent that can interact with the tools provided by that server. Parameters: - message: The message to send to the agent - messages: Optional list of message items with role and content - instructions: Optional custom instructions to override the default system prompt Returns: - response: The agent's response
   *
   * @tags dbtn/module:chat
   * @name mcp_query
   * @summary Mcp Query
   * @request POST:/routes/chat/query
   */
  mcp_query = (data: MCPRequest, params: RequestParams = {}) =>
    this.request<McpQueryData, McpQueryError>({
      path: `/routes/chat/query`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Query the app's MCP server with streaming response. This endpoint creates a connection to a local MCP server running on the URL specified by the INTERNAL_MCP_SSE_URL environment variable and streams the agent's response. Parameters: - message: The message to send to the agent - messages: Optional list of message items with role and content - instructions: Optional custom instructions to override the default system prompt Returns: - A streaming response with the agent's output
   *
   * @tags stream, dbtn/module:chat
   * @name mcp_query_stream
   * @summary Mcp Query Stream
   * @request POST:/routes/chat/query/stream
   */
  mcp_query_stream = (data: MCPRequest, params: RequestParams = {}) =>
    this.requestStream<McpQueryStreamData, McpQueryStreamError>({
      path: `/routes/chat/query/stream`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Adds two numbers and returns the result. Parameters: - num1: First number - num2: Second number Returns: - result: The sum of num1 and num2 - operation: The operation performed
   *
   * @tags dbtn/module:calculator
   * @name add_numbers
   * @summary Add Numbers
   * @request POST:/routes/add
   */
  add_numbers = (data: CalculatorRequest, params: RequestParams = {}) =>
    this.request<AddNumbersData, AddNumbersError>({
      path: `/routes/add`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Subtracts the second number from the first and returns the result. Parameters: - num1: First number - num2: Second number Returns: - result: The difference (num1 - num2) - operation: The operation performed
   *
   * @tags dbtn/module:calculator
   * @name subtract_numbers
   * @summary Subtract Numbers
   * @request POST:/routes/subtract
   */
  subtract_numbers = (data: CalculatorRequest, params: RequestParams = {}) =>
    this.request<SubtractNumbersData, SubtractNumbersError>({
      path: `/routes/subtract`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Multiplies two numbers and returns the result. Parameters: - num1: First number - num2: Second number Returns: - result: The product of num1 and num2 - operation: The operation performed
   *
   * @tags dbtn/module:calculator
   * @name multiply_numbers
   * @summary Multiply Numbers
   * @request POST:/routes/multiply
   */
  multiply_numbers = (data: CalculatorRequest, params: RequestParams = {}) =>
    this.request<MultiplyNumbersData, MultiplyNumbersError>({
      path: `/routes/multiply`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Divides the first number by the second and returns the result. Parameters: - num1: First number (dividend) - num2: Second number (divisor) Returns: - result: The quotient of num1 and num2 - operation: The operation performed
   *
   * @tags dbtn/module:calculator
   * @name divide_numbers
   * @summary Divide Numbers
   * @request POST:/routes/divide
   */
  divide_numbers = (data: CalculatorRequest, params: RequestParams = {}) =>
    this.request<DivideNumbersData, DivideNumbersError>({
      path: `/routes/divide`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Raises the first number to the power of the second and returns the result. Parameters: - num1: Base number - num2: Exponent Returns: - result: num1 raised to the power of num2 - operation: The operation performed
   *
   * @tags dbtn/module:calculator
   * @name power_numbers
   * @summary Power Numbers
   * @request POST:/routes/power
   */
  power_numbers = (data: CalculatorRequest, params: RequestParams = {}) =>
    this.request<PowerNumbersData, PowerNumbersError>({
      path: `/routes/power`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Summarizes a single contract into plain language. Useful for quickly understanding key terms and obligations.
   *
   * @tags dbtn/module:contract_summarizer
   * @name summarize_contract
   * @summary Summarize Contract
   * @request POST:/routes/summarize-contract
   */
  summarize_contract = (data: SummarizeContractRequest, params: RequestParams = {}) =>
    this.request<SummarizeContractData, SummarizeContractError>({
      path: `/routes/summarize-contract`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Standardizes waste invoice line items into known categories and formats. Helps unify billing across vendors and invoice styles.
   *
   * @tags dbtn/module:invoice_normalizer
   * @name normalize_invoice_items
   * @summary Normalize Invoice Items
   * @request POST:/routes/normalize-invoice-items
   */
  normalize_invoice_items = (data: NormalizeInvoiceItemsRequest, params: RequestParams = {}) =>
    this.request<NormalizeInvoiceItemsData, NormalizeInvoiceItemsError>({
      path: `/routes/normalize-invoice-items`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Builds a calendar view of potential pickup days from invoice service descriptions. Returns a list of estimated service dates in YYYY-MM-DD format.
   *
   * @tags dbtn/module:service_calendar
   * @name build_service_calendar
   * @summary Build Service Calendar
   * @request POST:/routes/build-service-calendar
   */
  build_service_calendar = (data: BuildServiceCalendarRequest, params: RequestParams = {}) =>
    this.request<BuildServiceCalendarData, BuildServiceCalendarError>({
      path: `/routes/build-service-calendar`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Stores a contract comparison result in Supabase. Returns the ID of the stored record.
   *
   * @tags dbtn/module:supabase_storage
   * @name store_comparison_result
   * @summary Store Comparison Result
   * @request POST:/routes/store-comparison-result
   */
  store_comparison_result = (data: StoreComparisonRequest, params: RequestParams = {}) =>
    this.request<StoreComparisonResultData, StoreComparisonResultError>({
      path: `/routes/store-comparison-result`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Generates an HTML report for a contract comparison stored in Supabase, identified by record_id. Returns a styled HTML document that can be downloaded or printed.
   *
   * @tags dbtn/module:generate_contract_comparison_report
   * @name generate_contract_comparison_report
   * @summary Generate Contract Comparison Report
   * @request GET:/routes/generate-contract-comparison-report
   */
  generate_contract_comparison_report = (query: GenerateContractComparisonReportParams, params: RequestParams = {}) =>
    this.request<GenerateContractComparisonReportData, GenerateContractComparisonReportError>({
      path: `/routes/generate-contract-comparison-report`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Compares two contracts using chunking and returns a summary, structured key differences, and any red flags. Results are stored in Supabase and returned to the caller.
   *
   * @tags dbtn/module:contract_comparison
   * @name compare_contracts
   * @summary Compare Contracts
   * @request POST:/routes/compare-contracts
   */
  compare_contracts = (data: CompareContractsRequest, params: RequestParams = {}) =>
    this.request<CompareContractsData, CompareContractsError>({
      path: `/routes/compare-contracts`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Receives email details and sends a plain email using db.notify.email.
   *
   * @tags Email, dbtn/module:email_sender
   * @name send_plain_email
   * @summary Send Plain Email
   * @request POST:/routes/email/send-plain-email
   */
  send_plain_email = (data: SendEmailRequest, params: RequestParams = {}) =>
    this.request<SendPlainEmailData, SendPlainEmailError>({
      path: `/routes/email/send-plain-email`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Calculates and returns key dashboard metrics including comparison counts, red flag statistics, and top user activity from Supabase.
   *
   * @tags dbtn/module:dashboard_summary
   * @name get_dashboard_summary
   * @summary Get Dashboard Summary
   * @request GET:/routes/get-dashboard-summary
   */
  get_dashboard_summary = (params: RequestParams = {}) =>
    this.request<GetDashboardSummaryData, any>({
      path: `/routes/get-dashboard-summary`,
      method: "GET",
      ...params,
    });

  /**
   * @description Fetches contract comparison history from Supabase, optionally filtering by user_id. Uses GET request with an optional 'user_id' query parameter.
   *
   * @tags dbtn/module:history_viewer
   * @name get_comparison_history
   * @summary Get Comparison History
   * @request GET:/routes/get-comparison-history
   */
  get_comparison_history = (query: GetComparisonHistoryParams, params: RequestParams = {}) =>
    this.request<GetComparisonHistoryData, GetComparisonHistoryError>({
      path: `/routes/get-comparison-history`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Receives a prompt and uses the specified Claude model via the Anthropic API to generate a response. Uses the ANTHROPIC_API_KEY secret.
   *
   * @tags dbtn/module:claude_analyzer
   * @name analyze_with_claude
   * @summary Analyze With Claude
   * @request POST:/routes/analyze-with-claude
   */
  analyze_with_claude = (data: ClaudeRequest, params: RequestParams = {}) =>
    this.request<AnalyzeWithClaudeData, AnalyzeWithClaudeError>({
      path: `/routes/analyze-with-claude`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Analyzes structured contract data based on a predefined set of rules. Identifies potential risks ('red flags') and returns them. Input should be a JSON object with fields like 'contract_term', 'cpi_cap', etc.
   *
   * @tags dbtn/module:red_flag_scanner
   * @name red_flag_scanner
   * @summary Red Flag Scanner
   * @request POST:/routes/scan-red-flags
   */
  red_flag_scanner = (data: ContractDataInput, params: RequestParams = {}) =>
    this.request<RedFlagScannerData, RedFlagScannerError>({
      path: `/routes/scan-red-flags`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Fetches a paginated list of comparison history records from the Supabase 'comparisons' table, selecting only essential columns for the list view.
   *
   * @tags dbtn/module:history
   * @name get_comparison_history2
   * @summary Get Comparison History2
   * @request GET:/routes/history
   */
  get_comparison_history2 = (query: GetComparisonHistory2Params, params: RequestParams = {}) =>
    this.request<GetComparisonHistory2Data, GetComparisonHistory2Error>({
      path: `/routes/history`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Fetches the full details for a single comparison record from the Supabase 'comparisons' table.
   *
   * @tags dbtn/module:history
   * @name get_comparison_details
   * @summary Get Comparison Details
   * @request GET:/routes/history/{record_id}
   */
  get_comparison_details = ({ recordId, ...query }: GetComparisonDetailsParams, params: RequestParams = {}) =>
    this.request<GetComparisonDetailsData, GetComparisonDetailsError>({
      path: `/routes/history/${recordId}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Retrieve a summary of all invoice processing results. Returns a list of invoices with their processing status and basic metadata.
   *
   * @tags dbtn/module:invoice_dashboard
   * @name get_invoice_summaries
   * @summary Get Invoice Summaries
   * @request GET:/routes/get_invoice_summaries
   */
  get_invoice_summaries = (params: RequestParams = {}) =>
    this.request<GetInvoiceSummariesData, any>({
      path: `/routes/get_invoice_summaries`,
      method: "GET",
      ...params,
    });

  /**
   * @description Retrieve line items for a specific invoice. Requires a storage_key parameter to identify the invoice. Returns detailed line items including description, quantity, prices, and metadata.
   *
   * @tags dbtn/module:invoice_dashboard
   * @name get_invoice_line_items
   * @summary Get Invoice Line Items
   * @request GET:/routes/get_invoice_line_items
   */
  get_invoice_line_items = (query: GetInvoiceLineItemsParams, params: RequestParams = {}) =>
    this.request<GetInvoiceLineItemsData, GetInvoiceLineItemsError>({
      path: `/routes/get_invoice_line_items`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Analyzes structured data from one or two waste invoices using Anthropic Claude and generates a detailed Markdown report including a Property Waste Review and either a Single-Invoice Insight or an Invoice-to-Invoice Comparison. Requires structured invoice data (from /extract-invoice-data) and property details (currently placeholders).
   *
   * @tags dbtn/module:invoice_analyzer
   * @name analyze_invoices
   * @summary Analyze Waste Invoices with AI (Structured Input)
   * @request POST:/routes/analyze-invoices
   */
  analyze_invoices = (data: InvoiceAnalysisRequest, params: RequestParams = {}) =>
    this.request<AnalyzeInvoicesData, AnalyzeInvoicesError>({
      path: `/routes/analyze-invoices`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Receives one or more invoice files (PDF, DOCX), validates them (basic check), saves them to db.storage.binary, and returns their storage keys.
   *
   * @tags invoice_parser, dbtn/module:invoice_parser
   * @name upload_invoices
   * @summary Upload Invoices
   * @request POST:/routes/upload-invoices
   */
  upload_invoices = (data: BodyUploadInvoices, params: RequestParams = {}) =>
    this.request<UploadInvoicesData, UploadInvoicesError>({
      path: `/routes/upload-invoices`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });

  /**
   * No description
   *
   * @tags invoice_parser, dbtn/module:invoice_parser
   * @name extract_invoice_data
   * @summary Extract Invoice Data
   * @request POST:/routes/extract-invoice-data
   */
  extract_invoice_data = (data: ExtractInvoiceRequest, params: RequestParams = {}) =>
    this.request<ExtractInvoiceDataData, ExtractInvoiceDataError>({
      path: `/routes/extract-invoice-data`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Starts a background task to extract data from an invoice using an upsert pattern. Immediately returns the storage key.
   *
   * @tags invoice_parser, dbtn/module:invoice_parser
   * @name create_invoice_extraction_task
   * @summary Create Invoice Extraction Task
   * @request POST:/routes/create-invoice-extraction-task
   */
  create_invoice_extraction_task = (data: ExtractInvoiceRequest, params: RequestParams = {}) =>
    this.request<CreateInvoiceExtractionTaskData, CreateInvoiceExtractionTaskError>({
      path: `/routes/create-invoice-extraction-task`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Process multiple invoices in bulk by their storage keys. Creates records with 'processing' status and processes them in the background. Returns a list of storage keys that can be used to check processing status.
   *
   * @tags invoice_parser, dbtn/module:invoice_parser
   * @name bulk_extract_invoice_data
   * @summary Bulk Extract Invoice Data
   * @request POST:/routes/bulk-extract-invoice-data
   */
  bulk_extract_invoice_data = (data: BulkInvoiceRequest, params: RequestParams = {}) =>
    this.request<BulkExtractInvoiceDataData, BulkExtractInvoiceDataError>({
      path: `/routes/bulk-extract-invoice-data`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Checks the processing status of invoice extraction tasks by their result IDs. Returns a mapping of result IDs to their current status.
   *
   * @tags invoice_parser, dbtn/module:invoice_parser
   * @name check_processing_status
   * @summary Check Processing Status
   * @request POST:/routes/check-processing-status
   */
  check_processing_status = (data: ProcessingStatusRequest, params: RequestParams = {}) =>
    this.request<CheckProcessingStatusData, CheckProcessingStatusError>({
      path: `/routes/check-processing-status`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Accepts one or two uploaded files (PDF/DOCX), saves them to binary storage with unique keys, and returns information about the stored files. This is the first step in starting a comparison analysis.
   *
   * @tags Analysis, dbtn/module:analysis
   * @name start_comparison_upload
   * @summary Start Comparison Upload
   * @request POST:/routes/analysis/start-comparison
   */
  start_comparison_upload = (data: BodyStartComparisonUpload, params: RequestParams = {}) =>
    this.request<StartComparisonUploadData, StartComparisonUploadError>({
      path: `/routes/analysis/start-comparison`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });

  /**
   * @description Sends an email containing a link to a specific contract comparison report. Fetches comparison details to include file names in the email subject/body. Constructs a public link based on the production deployment URL.
   *
   * @tags Communication, dbtn/module:communication
   * @name send_report_link_email
   * @summary Send Report Link Email
   * @request POST:/routes/communication/send-report-email
   */
  send_report_link_email = (data: AppApisCommunicationSendReportEmailRequest, params: RequestParams = {}) =>
    this.request<SendReportLinkEmailData, SendReportLinkEmailError>({
      path: `/routes/communication/send-report-email`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Generates a PDF report for a given comparison record ID, and emails it to the specified recipient.
   *
   * @tags Report Actions, dbtn/module:report_actions
   * @name send_report_pdf_email
   * @summary Send Report Pdf Email
   * @request POST:/routes/report-actions/send-report-email
   */
  send_report_pdf_email = (data: AppApisReportActionsSendReportEmailRequest, params: RequestParams = {}) =>
    this.request<SendReportPdfEmailData, SendReportPdfEmailError>({
      path: `/routes/report-actions/send-report-email`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}

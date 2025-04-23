import {
  AddNumbersData,
  AnalyzeInvoicesData,
  AnalyzeWithClaudeData,
  AppApisCommunicationSendReportEmailRequest,
  AppApisReportActionsSendReportEmailRequest,
  BodyStartComparisonUpload,
  BodyUploadInvoices,
  BuildServiceCalendarData,
  BuildServiceCalendarRequest,
  BulkExtractInvoiceDataData,
  BulkInvoiceRequest,
  CalculatorRequest,
  CheckHealthData,
  CheckProcessingStatusData,
  ClaudeRequest,
  CompareContractsData,
  CompareContractsRequest,
  ContractDataInput,
  CreateInvoiceExtractionTaskData,
  DivideNumbersData,
  ExtractInvoiceDataData,
  ExtractInvoiceRequest,
  GenerateContractComparisonReportData,
  GetComparisonDetailsData,
  GetComparisonHistory2Data,
  GetComparisonHistoryData,
  GetDashboardSummaryData,
  GetInvoiceLineItemsData,
  GetInvoiceSummariesData,
  InvoiceAnalysisRequest,
  MCPRequest,
  McpListToolsData,
  McpQueryData,
  McpQueryStreamData,
  MultiplyNumbersData,
  NormalizeInvoiceItemsData,
  NormalizeInvoiceItemsRequest,
  PowerNumbersData,
  ProcessingStatusRequest,
  RedFlagScannerData,
  SendEmailRequest,
  SendPlainEmailData,
  SendReportLinkEmailData,
  SendReportPdfEmailData,
  StartComparisonUploadData,
  StoreComparisonRequest,
  StoreComparisonResultData,
  SubtractNumbersData,
  SummarizeContractData,
  SummarizeContractRequest,
  UploadInvoicesData,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description List available tools in the MCP server running locally.
   * @tags dbtn/module:chat
   * @name mcp_list_tools
   * @summary Mcp List Tools
   * @request GET:/routes/chat/tools
   */
  export namespace mcp_list_tools {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = McpListToolsData;
  }

  /**
   * @description Query the app's MCP server running locally. This endpoint creates a connection to a local MCP server running on the URL specified by the INTERNAL_MCP_SSE_URL environment variable (defaults to localhost:9000/internal/sse) and runs an agent that can interact with the tools provided by that server. Parameters: - message: The message to send to the agent - messages: Optional list of message items with role and content - instructions: Optional custom instructions to override the default system prompt Returns: - response: The agent's response
   * @tags dbtn/module:chat
   * @name mcp_query
   * @summary Mcp Query
   * @request POST:/routes/chat/query
   */
  export namespace mcp_query {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = MCPRequest;
    export type RequestHeaders = {};
    export type ResponseBody = McpQueryData;
  }

  /**
   * @description Query the app's MCP server with streaming response. This endpoint creates a connection to a local MCP server running on the URL specified by the INTERNAL_MCP_SSE_URL environment variable and streams the agent's response. Parameters: - message: The message to send to the agent - messages: Optional list of message items with role and content - instructions: Optional custom instructions to override the default system prompt Returns: - A streaming response with the agent's output
   * @tags stream, dbtn/module:chat
   * @name mcp_query_stream
   * @summary Mcp Query Stream
   * @request POST:/routes/chat/query/stream
   */
  export namespace mcp_query_stream {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = MCPRequest;
    export type RequestHeaders = {};
    export type ResponseBody = McpQueryStreamData;
  }

  /**
   * @description Adds two numbers and returns the result. Parameters: - num1: First number - num2: Second number Returns: - result: The sum of num1 and num2 - operation: The operation performed
   * @tags dbtn/module:calculator
   * @name add_numbers
   * @summary Add Numbers
   * @request POST:/routes/add
   */
  export namespace add_numbers {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CalculatorRequest;
    export type RequestHeaders = {};
    export type ResponseBody = AddNumbersData;
  }

  /**
   * @description Subtracts the second number from the first and returns the result. Parameters: - num1: First number - num2: Second number Returns: - result: The difference (num1 - num2) - operation: The operation performed
   * @tags dbtn/module:calculator
   * @name subtract_numbers
   * @summary Subtract Numbers
   * @request POST:/routes/subtract
   */
  export namespace subtract_numbers {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CalculatorRequest;
    export type RequestHeaders = {};
    export type ResponseBody = SubtractNumbersData;
  }

  /**
   * @description Multiplies two numbers and returns the result. Parameters: - num1: First number - num2: Second number Returns: - result: The product of num1 and num2 - operation: The operation performed
   * @tags dbtn/module:calculator
   * @name multiply_numbers
   * @summary Multiply Numbers
   * @request POST:/routes/multiply
   */
  export namespace multiply_numbers {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CalculatorRequest;
    export type RequestHeaders = {};
    export type ResponseBody = MultiplyNumbersData;
  }

  /**
   * @description Divides the first number by the second and returns the result. Parameters: - num1: First number (dividend) - num2: Second number (divisor) Returns: - result: The quotient of num1 and num2 - operation: The operation performed
   * @tags dbtn/module:calculator
   * @name divide_numbers
   * @summary Divide Numbers
   * @request POST:/routes/divide
   */
  export namespace divide_numbers {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CalculatorRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DivideNumbersData;
  }

  /**
   * @description Raises the first number to the power of the second and returns the result. Parameters: - num1: Base number - num2: Exponent Returns: - result: num1 raised to the power of num2 - operation: The operation performed
   * @tags dbtn/module:calculator
   * @name power_numbers
   * @summary Power Numbers
   * @request POST:/routes/power
   */
  export namespace power_numbers {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CalculatorRequest;
    export type RequestHeaders = {};
    export type ResponseBody = PowerNumbersData;
  }

  /**
   * @description Summarizes a single contract into plain language. Useful for quickly understanding key terms and obligations.
   * @tags dbtn/module:contract_summarizer
   * @name summarize_contract
   * @summary Summarize Contract
   * @request POST:/routes/summarize-contract
   */
  export namespace summarize_contract {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SummarizeContractRequest;
    export type RequestHeaders = {};
    export type ResponseBody = SummarizeContractData;
  }

  /**
   * @description Standardizes waste invoice line items into known categories and formats. Helps unify billing across vendors and invoice styles.
   * @tags dbtn/module:invoice_normalizer
   * @name normalize_invoice_items
   * @summary Normalize Invoice Items
   * @request POST:/routes/normalize-invoice-items
   */
  export namespace normalize_invoice_items {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = NormalizeInvoiceItemsRequest;
    export type RequestHeaders = {};
    export type ResponseBody = NormalizeInvoiceItemsData;
  }

  /**
   * @description Builds a calendar view of potential pickup days from invoice service descriptions. Returns a list of estimated service dates in YYYY-MM-DD format.
   * @tags dbtn/module:service_calendar
   * @name build_service_calendar
   * @summary Build Service Calendar
   * @request POST:/routes/build-service-calendar
   */
  export namespace build_service_calendar {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BuildServiceCalendarRequest;
    export type RequestHeaders = {};
    export type ResponseBody = BuildServiceCalendarData;
  }

  /**
   * @description Stores a contract comparison result in Supabase. Returns the ID of the stored record.
   * @tags dbtn/module:supabase_storage
   * @name store_comparison_result
   * @summary Store Comparison Result
   * @request POST:/routes/store-comparison-result
   */
  export namespace store_comparison_result {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = StoreComparisonRequest;
    export type RequestHeaders = {};
    export type ResponseBody = StoreComparisonResultData;
  }

  /**
   * @description Generates an HTML report for a contract comparison stored in Supabase, identified by record_id. Returns a styled HTML document that can be downloaded or printed.
   * @tags dbtn/module:generate_contract_comparison_report
   * @name generate_contract_comparison_report
   * @summary Generate Contract Comparison Report
   * @request GET:/routes/generate-contract-comparison-report
   */
  export namespace generate_contract_comparison_report {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Record Id
       * ID of the comparison record in Supabase
       */
      record_id: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GenerateContractComparisonReportData;
  }

  /**
   * @description Compares two contracts using chunking and returns a summary, structured key differences, and any red flags. Results are stored in Supabase and returned to the caller.
   * @tags dbtn/module:contract_comparison
   * @name compare_contracts
   * @summary Compare Contracts
   * @request POST:/routes/compare-contracts
   */
  export namespace compare_contracts {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CompareContractsRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CompareContractsData;
  }

  /**
   * @description Receives email details and sends a plain email using db.notify.email.
   * @tags Email, dbtn/module:email_sender
   * @name send_plain_email
   * @summary Send Plain Email
   * @request POST:/routes/email/send-plain-email
   */
  export namespace send_plain_email {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SendEmailRequest;
    export type RequestHeaders = {};
    export type ResponseBody = SendPlainEmailData;
  }

  /**
   * @description Calculates and returns key dashboard metrics including comparison counts, red flag statistics, and top user activity from Supabase.
   * @tags dbtn/module:dashboard_summary
   * @name get_dashboard_summary
   * @summary Get Dashboard Summary
   * @request GET:/routes/get-dashboard-summary
   */
  export namespace get_dashboard_summary {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetDashboardSummaryData;
  }

  /**
   * @description Fetches contract comparison history from Supabase, optionally filtering by user_id. Uses GET request with an optional 'user_id' query parameter.
   * @tags dbtn/module:history_viewer
   * @name get_comparison_history
   * @summary Get Comparison History
   * @request GET:/routes/get-comparison-history
   */
  export namespace get_comparison_history {
    export type RequestParams = {};
    export type RequestQuery = {
      /** User Id */
      user_id?: string | null;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetComparisonHistoryData;
  }

  /**
   * @description Receives a prompt and uses the specified Claude model via the Anthropic API to generate a response. Uses the ANTHROPIC_API_KEY secret.
   * @tags dbtn/module:claude_analyzer
   * @name analyze_with_claude
   * @summary Analyze With Claude
   * @request POST:/routes/analyze-with-claude
   */
  export namespace analyze_with_claude {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ClaudeRequest;
    export type RequestHeaders = {};
    export type ResponseBody = AnalyzeWithClaudeData;
  }

  /**
   * @description Analyzes structured contract data based on a predefined set of rules. Identifies potential risks ('red flags') and returns them. Input should be a JSON object with fields like 'contract_term', 'cpi_cap', etc.
   * @tags dbtn/module:red_flag_scanner
   * @name red_flag_scanner
   * @summary Red Flag Scanner
   * @request POST:/routes/scan-red-flags
   */
  export namespace red_flag_scanner {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ContractDataInput;
    export type RequestHeaders = {};
    export type ResponseBody = RedFlagScannerData;
  }

  /**
   * @description Fetches a paginated list of comparison history records from the Supabase 'comparisons' table, selecting only essential columns for the list view.
   * @tags dbtn/module:history
   * @name get_comparison_history2
   * @summary Get Comparison History2
   * @request GET:/routes/history
   */
  export namespace get_comparison_history2 {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Limit
       * Number of records per page
       * @min 1
       * @max 100
       * @default 20
       */
      limit?: number;
      /**
       * Offset
       * Number of records to skip for pagination
       * @min 0
       * @default 0
       */
      offset?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetComparisonHistory2Data;
  }

  /**
   * @description Fetches the full details for a single comparison record from the Supabase 'comparisons' table.
   * @tags dbtn/module:history
   * @name get_comparison_details
   * @summary Get Comparison Details
   * @request GET:/routes/history/{record_id}
   */
  export namespace get_comparison_details {
    export type RequestParams = {
      /**
       * Record Id
       * The ID of the comparison record to fetch
       */
      recordId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetComparisonDetailsData;
  }

  /**
   * @description Retrieve a summary of all invoice processing results. Returns a list of invoices with their processing status and basic metadata.
   * @tags dbtn/module:invoice_dashboard
   * @name get_invoice_summaries
   * @summary Get Invoice Summaries
   * @request GET:/routes/get_invoice_summaries
   */
  export namespace get_invoice_summaries {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetInvoiceSummariesData;
  }

  /**
   * @description Retrieve line items for a specific invoice. Requires a storage_key parameter to identify the invoice. Returns detailed line items including description, quantity, prices, and metadata.
   * @tags dbtn/module:invoice_dashboard
   * @name get_invoice_line_items
   * @summary Get Invoice Line Items
   * @request GET:/routes/get_invoice_line_items
   */
  export namespace get_invoice_line_items {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Storage Key
       * Storage key of the invoice
       */
      storage_key: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetInvoiceLineItemsData;
  }

  /**
   * @description Analyzes structured data from one or two waste invoices using Anthropic Claude and generates a detailed Markdown report including a Property Waste Review and either a Single-Invoice Insight or an Invoice-to-Invoice Comparison. Requires structured invoice data (from /extract-invoice-data) and property details (currently placeholders).
   * @tags dbtn/module:invoice_analyzer
   * @name analyze_invoices
   * @summary Analyze Waste Invoices with AI (Structured Input)
   * @request POST:/routes/analyze-invoices
   */
  export namespace analyze_invoices {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = InvoiceAnalysisRequest;
    export type RequestHeaders = {};
    export type ResponseBody = AnalyzeInvoicesData;
  }

  /**
   * @description Receives one or more invoice files (PDF, DOCX), validates them (basic check), saves them to db.storage.binary, and returns their storage keys.
   * @tags invoice_parser, dbtn/module:invoice_parser
   * @name upload_invoices
   * @summary Upload Invoices
   * @request POST:/routes/upload-invoices
   */
  export namespace upload_invoices {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BodyUploadInvoices;
    export type RequestHeaders = {};
    export type ResponseBody = UploadInvoicesData;
  }

  /**
   * No description
   * @tags invoice_parser, dbtn/module:invoice_parser
   * @name extract_invoice_data
   * @summary Extract Invoice Data
   * @request POST:/routes/extract-invoice-data
   */
  export namespace extract_invoice_data {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ExtractInvoiceRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ExtractInvoiceDataData;
  }

  /**
   * @description Starts a background task to extract data from an invoice using an upsert pattern. Immediately returns the storage key.
   * @tags invoice_parser, dbtn/module:invoice_parser
   * @name create_invoice_extraction_task
   * @summary Create Invoice Extraction Task
   * @request POST:/routes/create-invoice-extraction-task
   */
  export namespace create_invoice_extraction_task {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ExtractInvoiceRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CreateInvoiceExtractionTaskData;
  }

  /**
   * @description Process multiple invoices in bulk by their storage keys. Creates records with 'processing' status and processes them in the background. Returns a list of storage keys that can be used to check processing status.
   * @tags invoice_parser, dbtn/module:invoice_parser
   * @name bulk_extract_invoice_data
   * @summary Bulk Extract Invoice Data
   * @request POST:/routes/bulk-extract-invoice-data
   */
  export namespace bulk_extract_invoice_data {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BulkInvoiceRequest;
    export type RequestHeaders = {};
    export type ResponseBody = BulkExtractInvoiceDataData;
  }

  /**
   * @description Checks the processing status of invoice extraction tasks by their result IDs. Returns a mapping of result IDs to their current status.
   * @tags invoice_parser, dbtn/module:invoice_parser
   * @name check_processing_status
   * @summary Check Processing Status
   * @request POST:/routes/check-processing-status
   */
  export namespace check_processing_status {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ProcessingStatusRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CheckProcessingStatusData;
  }

  /**
   * @description Accepts one or two uploaded files (PDF/DOCX), saves them to binary storage with unique keys, and returns information about the stored files. This is the first step in starting a comparison analysis.
   * @tags Analysis, dbtn/module:analysis
   * @name start_comparison_upload
   * @summary Start Comparison Upload
   * @request POST:/routes/analysis/start-comparison
   */
  export namespace start_comparison_upload {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BodyStartComparisonUpload;
    export type RequestHeaders = {};
    export type ResponseBody = StartComparisonUploadData;
  }

  /**
   * @description Sends an email containing a link to a specific contract comparison report. Fetches comparison details to include file names in the email subject/body. Constructs a public link based on the production deployment URL.
   * @tags Communication, dbtn/module:communication
   * @name send_report_link_email
   * @summary Send Report Link Email
   * @request POST:/routes/communication/send-report-email
   */
  export namespace send_report_link_email {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = AppApisCommunicationSendReportEmailRequest;
    export type RequestHeaders = {};
    export type ResponseBody = SendReportLinkEmailData;
  }

  /**
   * @description Generates a PDF report for a given comparison record ID, and emails it to the specified recipient.
   * @tags Report Actions, dbtn/module:report_actions
   * @name send_report_pdf_email
   * @summary Send Report Pdf Email
   * @request POST:/routes/report-actions/send-report-email
   */
  export namespace send_report_pdf_email {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = AppApisReportActionsSendReportEmailRequest;
    export type RequestHeaders = {};
    export type ResponseBody = SendReportPdfEmailData;
  }
}

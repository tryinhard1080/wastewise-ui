/** Body_start_comparison_upload */
export interface BodyStartComparisonUpload {
  /**
   * Files
   * One or two files (PDF/DOCX) for comparison
   */
  files: File[];
}

/** Body_upload_invoices */
export interface BodyUploadInvoices {
  /** Files */
  files: File[];
}

/** BuildServiceCalendarRequest */
export interface BuildServiceCalendarRequest {
  /** Contract Text */
  contract_text: string;
}

/** BuildServiceCalendarResponse */
export interface BuildServiceCalendarResponse {
  /** Service Schedule */
  service_schedule?: ServiceScheduleEntry[];
  /**
   * Raw Extracted Json
   * Raw JSON output from LLM for debugging
   */
  raw_extracted_json?: string | null;
}

/** BulkInvoiceRequest */
export interface BulkInvoiceRequest {
  /**
   * Storage Keys
   * List of storage keys for the invoices to process.
   */
  storage_keys: string[];
}

/** CalculatorRequest */
export interface CalculatorRequest {
  /** Num1 */
  num1: number;
  /** Num2 */
  num2: number;
}

/** CalculatorResponse */
export interface CalculatorResponse {
  /** Result */
  result: number;
  /** Operation */
  operation: string;
}

/** ClaudeRequest */
export interface ClaudeRequest {
  /** Prompt */
  prompt: string;
  /**
   * Model
   * @default "claude-3-haiku-20240307"
   */
  model?: string;
  /**
   * Max Tokens
   * @default 1024
   */
  max_tokens?: number;
  /**
   * Temperature
   * @default 0.5
   */
  temperature?: number;
}

/** ClaudeResponse */
export interface ClaudeResponse {
  /** Result */
  result: string;
}

/** CompareContractsRequest */
export interface CompareContractsRequest {
  /** Contract 1 Text */
  contract_1_text: string;
  /** Contract 2 Text */
  contract_2_text: string;
  /** File1 Name */
  file1_name: string;
  /** File2 Name */
  file2_name: string;
  /**
   * User Id
   * @default "anonymous@trashhub.ai"
   */
  user_id?: string | null;
}

/** CompareContractsResponse */
export interface CompareContractsResponse {
  /** Comparison Summary */
  comparison_summary: string;
  /** Key Differences */
  key_differences: Record<string, string[]>;
  /** Red Flags */
  red_flags: string[];
  /** Stored Record Id */
  stored_record_id?: string | null;
}

/** ComparisonRecord */
export interface ComparisonRecord {
  /** Id */
  id: string;
  /** File1 Name */
  file1_name?: string | null;
  /** File2 Name */
  file2_name?: string | null;
  /** Comparison Summary */
  comparison_summary?: string | null;
  /** Red Flags */
  red_flags?: string[] | null;
  /** User Id */
  user_id?: string | null;
  /** Created At */
  created_at: string;
}

/** ContractDataInput */
export interface ContractDataInput {
  /**
   * Contract Term
   * Duration of the contract in months.
   */
  contract_term?: number | null;
  /**
   * Termination Notice Period
   * Required notice period for termination in days.
   */
  termination_notice_period?: number | null;
  /**
   * Cpi Cap
   * Maximum percentage for CPI-based price increases.
   */
  cpi_cap?: number | null;
  /**
   * Auto Renewal Clause
   * Indicates if an auto-renewal clause is present.
   */
  auto_renewal_clause?: boolean | null;
  /**
   * Fuel Surcharge
   * Describes the fuel surcharge policy (e.g., 'Fixed', 'Capped', 'Variable', or missing).
   */
  fuel_surcharge?: string | null;
}

/** DashboardMetrics */
export interface DashboardMetrics {
  /**
   * Total Comparisons
   * @default 0
   */
  total_comparisons?: number;
  /**
   * Comparisons With Flags
   * @default 0
   */
  comparisons_with_flags?: number;
  /**
   * Percentage With Flags
   * @default 0
   */
  percentage_with_flags?: number;
  /**
   * Total Red Flags
   * @default 0
   */
  total_red_flags?: number;
  /**
   * Average Flags Per Comparison
   * @default 0
   */
  average_flags_per_comparison?: number;
  /** Top Users */
  top_users?: TopUser[];
}

/** ExtractInvoiceRequest */
export interface ExtractInvoiceRequest {
  /**
   * Storage Key
   * The storage key of the uploaded PDF invoice in db.storage.binary.
   */
  storage_key: string;
}

/** ExtractedInvoiceData */
export interface ExtractedInvoiceData {
  /**
   * Score Details
   * Overall scoring details for the invoice, stored as JSONB
   */
  score_details?: Record<string, any> | null;
  /**
   * Raw Llm Output
   * Raw JSON output directly from the LLM, stored as JSONB
   */
  raw_llm_output?: Record<string, any> | null;
  /**
   * Vendor Name
   * Name of the waste hauling company
   */
  vendor_name?: string | null;
  /**
   * Invoice Date
   * Date the invoice was issued, ideally YYYY-MM-DD
   */
  invoice_date?: string | null;
  /**
   * Due Date
   * Payment due date, ideally YYYY-MM-DD
   */
  due_date?: string | null;
  /**
   * Service Period Start
   * Start date of the service period covered
   */
  service_period_start?: string | null;
  /**
   * Service Period End
   * End date of the service period covered
   */
  service_period_end?: string | null;
  /**
   * Service Address
   * Full address where services were provided
   */
  service_address?: string | null;
  /**
   * Total Cost
   * Final numeric total amount due for the invoice
   */
  total_cost?: number | null;
  /**
   * Line Items
   * Detailed list of service line items extracted
   */
  line_items?: ExtractedLineItem[];
  /**
   * Property Name
   * Name of the property associated with the invoice
   */
  property_name?: string | null;
  /**
   * Unit Count
   * Number of units at the property
   */
  unit_count?: number | null;
  /**
   * Property Type
   * Type of property, e.g., Garden Style, Mid-Rise
   */
  property_type?: string | null;
  /**
   * Property Context
   * Context about the property, e.g., from filename or user input
   */
  property_context?: string | null;
  /**
   * Container Sizes
   * List of unique container sizes mentioned
   */
  container_sizes?: string[] | null;
  /**
   * Service Frequency
   * Overall service frequency if applicable
   */
  service_frequency?: string | null;
  /**
   * Total Yards
   * Total volume in yards, if explicitly stated or calculated
   */
  total_yards?: number | null;
  /**
   * Compactor Hauls
   * Number of compactor hauls, if mentioned
   */
  compactor_hauls?: number | null;
  /**
   * Tonnage
   * Total tonnage, if mentioned
   */
  tonnage?: number | null;
  /**
   * Surcharges
   * List of surcharge descriptions/amounts
   */
  surcharges?: InvoiceSurcharge[];
  /**
   * Raw Text
   * The full raw text extracted from the PDF
   */
  raw_text?: string | null;
  /**
   * Raw Extracted Json
   * The raw JSON output from the LLM
   */
  raw_extracted_json?: Record<string, any> | null;
  /**
   * Storage Key
   * The storage key associated with this invoice data
   */
  storage_key?: string | null;
  /**
   * Error
   * Error message if processing failed or validation issues occurred
   */
  error?: string | null;
}

/** ExtractedLineItem */
export interface ExtractedLineItem {
  /**
   * Metadata
   * Additional metadata for the line item, stored as JSONB
   */
  metadata?: Record<string, any> | null;
  /**
   * Material Type
   * Type of material, e.g., 'Trash', 'Recycling', 'Compost'
   */
  material_type?: string | null;
  /**
   * Container Size
   * Size of the container, e.g., '2yd', '4yd', '96gal'
   */
  container_size?: string | null;
  /**
   * Frequency
   * Pickup frequency, e.g., '1x/week', 'On Call'
   */
  frequency?: string | null;
  /**
   * Pickup Count
   * Estimated number of pickups in the service period
   */
  pickup_count?: number | null;
  /**
   * Total Yards
   * Total yards for this line item (if applicable/calculable)
   */
  total_yards?: number | null;
  /**
   * Line Total Cost
   * The total cost associated with this specific line item
   */
  line_total_cost?: number | null;
  /**
   * Line Description
   * The raw description text for this line item
   */
  line_description?: string | null;
  /**
   * Score Details
   * Detailed breakdown of scores based on benchmarks
   */
  score_details?: Record<string, any> | null;
  /**
   * Benchmark Flags
   * List of flags indicating deviations from benchmarks
   */
  benchmark_flags?: string[] | null;
  /**
   * Overall Score
   * Calculated overall score for the line item (0-10)
   */
  overall_score?: number | null;
  /** Storage Key */
  storage_key?: string | null;
  /** Invoice Date */
  invoice_date?: string | null;
  /** Vendor Name */
  vendor_name?: string | null;
}

/** FileUploadResponse */
export interface FileUploadResponse {
  /** Message */
  message: string;
  /** Stored Files */
  stored_files: StoredFileInfo[];
  /** Comparison Id */
  comparison_id?: string | null;
}

/** FullComparisonRecord */
export interface FullComparisonRecord {
  /** Id */
  id: string;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /** File1 Name */
  file1_name?: string | null;
  /** File2 Name */
  file2_name?: string | null;
  /** Comparison Summary */
  comparison_summary?: string | null;
  /** Red Flags */
  red_flags?: string[] | null;
  /** Line Items */
  line_items?: Record<string, any>[] | null;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** HistoryItem */
export interface HistoryItem {
  /** Id */
  id: string;
  /**
   * Createdat
   * @format date-time
   */
  createdAt: string;
  /** File1Name */
  file1Name?: string | null;
  /** File2Name */
  file2Name?: string | null;
  /** Redflags */
  redFlags?: string[] | null;
}

/** InitialProcessingResponse */
export interface InitialProcessingResponse {
  /**
   * Result Ids
   * List of result IDs that were created for background processing
   */
  result_ids: string[];
  /**
   * Message
   * Status message about the background processing request
   */
  message: string;
}

/** InvoiceAnalysisRequest */
export interface InvoiceAnalysisRequest {
  /**
   * Invoices Data
   * List containing structured data for 1 or 2 invoices.
   * @maxItems 2
   * @minItems 1
   */
  invoices_data: ExtractedInvoiceData[];
  /**
   * Property Name
   * Property name from KB lookup (Placeholder).
   * @default "Unknown"
   */
  property_name?: string | null;
  /**
   * Property Units
   * Number of units/doors from KB lookup (Placeholder).
   * @default "Unknown"
   */
  property_units?: string | null;
  /**
   * Property City
   * Property city from KB lookup (Placeholder).
   * @default "Unknown"
   */
  property_city?: string | null;
  /**
   * Property State
   * Property state from KB lookup (Placeholder).
   * @default "Unknown"
   */
  property_state?: string | null;
  /**
   * Asset Type
   * Asset type from KB lookup (Placeholder).
   * @default "Multifamily"
   */
  asset_type?: string | null;
  /**
   * Client Owner
   * Client/Owner from KB lookup (Placeholder).
   * @default "Greystar"
   */
  client_owner?: string | null;
}

/** InvoiceAnalysisResponse */
export interface InvoiceAnalysisResponse {
  /**
   * Analysis Markdown
   * Markdown report generated by the AI based on the invoice(s).
   */
  analysis_markdown: string;
}

/** InvoiceResult */
export interface InvoiceResult {
  /** Storage Key */
  storage_key: string;
  /** Vendor Name */
  vendor_name?: string | null;
  /** Invoice Date */
  invoice_date?: string | null;
  /** Total Cost */
  total_cost?: number | null;
  /** Processing Status */
  processing_status?: string | null;
}

/** InvoiceResults */
export interface InvoiceResults {
  /** Results */
  results: InvoiceResult[];
}

/** InvoiceSurcharge */
export interface InvoiceSurcharge {
  /** Description */
  description?: string | null;
  /** Amount */
  amount?: number | null;
}

/** LineItem */
export interface LineItem {
  /** Description */
  description: string;
  /** Quantity */
  quantity?: number | null;
  /** Unit Price */
  unit_price?: number | null;
  /** Total */
  total?: number | null;
  /** Metadata */
  metadata?: Record<string, any> | null;
}

/** LineItems */
export interface LineItems {
  /** Items */
  items: LineItem[];
}

/** ListToolResponse */
export interface ListToolResponse {
  /** Tools */
  tools: Record<string, any>[];
}

/** MCPRequest */
export interface MCPRequest {
  /** Message */
  message?: string | null;
  /** Messages */
  messages?: MessageItem[] | null;
  /**
   * Stream
   * @default false
   */
  stream?: boolean | null;
  /** Instructions */
  instructions?: string | null;
}

/** MCPResponse */
export interface MCPResponse {
  /** Response */
  response: string;
}

/** MessageItem */
export interface MessageItem {
  /** Role */
  role: string;
  /** Content */
  content: string;
}

/** NormalizeInvoiceItemsRequest */
export interface NormalizeInvoiceItemsRequest {
  /**
   * Line Items
   * A list of raw line item strings from an invoice.
   */
  line_items: string[];
}

/** NormalizeInvoiceItemsResponse */
export interface NormalizeInvoiceItemsResponse {
  /** Normalized Items */
  normalized_items?: NormalizedItem[];
  /**
   * Raw Extracted Json
   * Raw JSON output from LLM for debugging
   */
  raw_extracted_json?: string | null;
}

/** NormalizedItem */
export interface NormalizedItem {
  /**
   * Original Item
   * The original line item text from the invoice.
   */
  original_item: string;
  /**
   * Service Type
   * Standardized service category (e.g., 'Haul Fee', 'Disposal Fee', 'Rental Fee', 'Fuel Surcharge', 'Environmental Fee', 'Late Fee', 'Other').
   */
  service_type?: string | null;
  /**
   * Container Size
   * Size of the container if mentioned (e.g., '6 Yard', '8 yd', '20 cubic yard').
   */
  container_size?: string | null;
  /**
   * Frequency
   * Service frequency if mentioned (e.g., 'Weekly', 'Monthly', 'On Call').
   */
  frequency?: string | null;
  /**
   * Quantity
   * Quantity associated with the line item, if applicable.
   */
  quantity?: number | null;
  /**
   * Unit Price
   * Unit price, if discernible.
   */
  unit_price?: number | null;
  /**
   * Total Price
   * Total price for the line item, if discernible.
   */
  total_price?: number | null;
  /**
   * Notes
   * Any other relevant extracted details or context.
   */
  notes?: string | null;
}

/** ProcessingStatusRequest */
export interface ProcessingStatusRequest {
  /**
   * Result Ids
   * List of result IDs to check status for
   */
  result_ids: string[];
}

/** ProcessingStatusResponse */
export interface ProcessingStatusResponse {
  /**
   * Statuses
   * Map of result IDs to their current status
   */
  statuses: Record<string, string>;
}

/** RedFlagResult */
export interface RedFlagResult {
  /**
   * Field
   * The specific contract field that triggered the flag.
   */
  field: string;
  /**
   * Severity
   * The severity level of the flag (e.g., high, medium, low).
   */
  severity: string;
  /**
   * Message
   * A description of why the flag was triggered.
   */
  message: string;
  /**
   * Actual Value
   * The actual value from the contract data that triggered the flag.
   */
  actual_value: any;
}

/** RedFlagScannerResponse */
export interface RedFlagScannerResponse {
  /**
   * Red Flags
   * A list of identified red flags based on the rules.
   */
  red_flags?: RedFlagResult[];
}

/** SendEmailRequest */
export interface SendEmailRequest {
  /**
   * Recipient Email
   * @format email
   */
  recipient_email: string;
  /** Subject */
  subject: string;
  /** Content Text */
  content_text: string;
  /** Content Html */
  content_html?: string | null;
}

/** SendReportEmailResponse */
export interface SendReportEmailResponse {
  /** Success */
  success: boolean;
  /** Message */
  message: string;
}

/** ServiceScheduleEntry */
export interface ServiceScheduleEntry {
  /**
   * Service Description
   * Description of the service (e.g., 'Trash Collection', 'Recycling Pickup')
   */
  service_description?: string | null;
  /**
   * Frequency
   * How often the service occurs (e.g., 'Weekly', 'Bi-weekly', 'Monthly')
   */
  frequency?: string | null;
  /**
   * Day Of Week
   * Specific day(s) service occurs (e.g., 'Tuesday', 'Mon, Wed, Fri')
   */
  day_of_week?: string | null;
  /**
   * Time Of Day
   * Specific time or window if mentioned (e.g., '8:00 AM', 'Morning', 'Between 6 AM and 6 PM')
   */
  time_of_day?: string | null;
  /**
   * Notes
   * Any other relevant details about the schedule.
   */
  notes?: string | null;
}

/** StoreComparisonRequest */
export interface StoreComparisonRequest {
  /** File1 Name */
  file1_name: string;
  /** File2 Name */
  file2_name: string;
  /** Contract1 Text */
  contract1_text: string;
  /** Contract2 Text */
  contract2_text: string;
  /** Comparison Summary */
  comparison_summary: string;
  /** Key Differences */
  key_differences: Record<string, any> | any[];
  /** User Id */
  user_id?: string | null;
  /** Red Flags */
  red_flags?: Record<string, any> | any[] | null;
  /**
   * Source Tool
   * Tool that generated the comparison, e.g., 'compare_contracts'
   */
  source_tool?: string | null;
}

/** StoreComparisonResponse */
export interface StoreComparisonResponse {
  /** Success */
  success: boolean;
  /** Message */
  message: string;
  /** Inserted Id */
  inserted_id?: string | null;
}

/** StoredFileInfo */
export interface StoredFileInfo {
  /** Original Filename */
  original_filename: string;
  /** Storage Key */
  storage_key: string;
}

/** SummarizeContractRequest */
export interface SummarizeContractRequest {
  /** Contract Text */
  contract_text: string;
}

/** SummarizeContractResponse */
export interface SummarizeContractResponse {
  /** Summary Text */
  summary_text: string;
}

/** TopUser */
export interface TopUser {
  /** User Id */
  user_id: string;
  /** Comparison Count */
  comparison_count: number;
}

/** UploadResponse */
export interface UploadResponse {
  /**
   * Storage Keys
   * List of keys for successfully uploaded and validated files.
   */
  storage_keys?: string[];
  /**
   * Errors
   * List of errors encountered during upload or validation.
   */
  errors?: string[];
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

/** SendEmailResponse */
export interface AppApisCommunicationSendEmailResponse {
  /** Message */
  message: string;
}

/** SendReportEmailRequest */
export interface AppApisCommunicationSendReportEmailRequest {
  /** Comparison Id */
  comparison_id: string;
  /** Recipients */
  recipients: string[];
}

/** SendEmailResponse */
export interface AppApisEmailSenderSendEmailResponse {
  /** Success */
  success: boolean;
  /** Message */
  message: string;
}

/** HistoryResponse */
export interface AppApisHistoryHistoryResponse {
  /** History */
  history: HistoryItem[];
  /** Total Count */
  total_count: number;
}

/** HistoryResponse */
export interface AppApisHistoryViewerHistoryResponse {
  /** History */
  history: ComparisonRecord[];
}

/** SendReportEmailRequest */
export interface AppApisReportActionsSendReportEmailRequest {
  /** Record Id */
  record_id: string;
  /**
   * Recipient Email
   * @format email
   */
  recipient_email: string;
}

export type CheckHealthData = HealthResponse;

export type McpListToolsData = ListToolResponse;

export type McpQueryData = MCPResponse;

export type McpQueryError = HTTPValidationError;

export type McpQueryStreamData = any;

export type McpQueryStreamError = HTTPValidationError;

export type AddNumbersData = CalculatorResponse;

export type AddNumbersError = HTTPValidationError;

export type SubtractNumbersData = CalculatorResponse;

export type SubtractNumbersError = HTTPValidationError;

export type MultiplyNumbersData = CalculatorResponse;

export type MultiplyNumbersError = HTTPValidationError;

export type DivideNumbersData = CalculatorResponse;

export type DivideNumbersError = HTTPValidationError;

export type PowerNumbersData = CalculatorResponse;

export type PowerNumbersError = HTTPValidationError;

export type SummarizeContractData = SummarizeContractResponse;

export type SummarizeContractError = HTTPValidationError;

export type NormalizeInvoiceItemsData = NormalizeInvoiceItemsResponse;

export type NormalizeInvoiceItemsError = HTTPValidationError;

export type BuildServiceCalendarData = BuildServiceCalendarResponse;

export type BuildServiceCalendarError = HTTPValidationError;

export type StoreComparisonResultData = StoreComparisonResponse;

export type StoreComparisonResultError = HTTPValidationError;

export interface GenerateContractComparisonReportParams {
  /**
   * Record Id
   * ID of the comparison record in Supabase
   */
  record_id: string;
}

export type GenerateContractComparisonReportData = string;

export type GenerateContractComparisonReportError = HTTPValidationError;

export type CompareContractsData = CompareContractsResponse;

export type CompareContractsError = HTTPValidationError;

export type SendPlainEmailData = AppApisEmailSenderSendEmailResponse;

export type SendPlainEmailError = HTTPValidationError;

export type GetDashboardSummaryData = DashboardMetrics;

export interface GetComparisonHistoryParams {
  /** User Id */
  user_id?: string | null;
}

export type GetComparisonHistoryData = AppApisHistoryViewerHistoryResponse;

export type GetComparisonHistoryError = HTTPValidationError;

export type AnalyzeWithClaudeData = ClaudeResponse;

export type AnalyzeWithClaudeError = HTTPValidationError;

export type RedFlagScannerData = RedFlagScannerResponse;

export type RedFlagScannerError = HTTPValidationError;

export interface GetComparisonHistory2Params {
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
}

export type GetComparisonHistory2Data = AppApisHistoryHistoryResponse;

export type GetComparisonHistory2Error = HTTPValidationError;

export interface GetComparisonDetailsParams {
  /**
   * Record Id
   * The ID of the comparison record to fetch
   */
  recordId: string;
}

export type GetComparisonDetailsData = FullComparisonRecord;

export type GetComparisonDetailsError = HTTPValidationError;

export type GetInvoiceSummariesData = InvoiceResults;

export interface GetInvoiceLineItemsParams {
  /**
   * Storage Key
   * Storage key of the invoice
   */
  storage_key: string;
}

export type GetInvoiceLineItemsData = LineItems;

export type GetInvoiceLineItemsError = HTTPValidationError;

export type AnalyzeInvoicesData = InvoiceAnalysisResponse;

export type AnalyzeInvoicesError = HTTPValidationError;

export type UploadInvoicesData = UploadResponse;

export type UploadInvoicesError = HTTPValidationError;

export type ExtractInvoiceDataData = ExtractedInvoiceData;

export type ExtractInvoiceDataError = HTTPValidationError;

/** Response Create Invoice Extraction Task */
export type CreateInvoiceExtractionTaskData = string;

export type CreateInvoiceExtractionTaskError = HTTPValidationError;

export type BulkExtractInvoiceDataData = InitialProcessingResponse;

export type BulkExtractInvoiceDataError = HTTPValidationError;

export type CheckProcessingStatusData = ProcessingStatusResponse;

export type CheckProcessingStatusError = HTTPValidationError;

export type StartComparisonUploadData = FileUploadResponse;

export type StartComparisonUploadError = HTTPValidationError;

export type SendReportLinkEmailData = AppApisCommunicationSendEmailResponse;

export type SendReportLinkEmailError = HTTPValidationError;

export type SendReportPdfEmailData = SendReportEmailResponse;

export type SendReportPdfEmailError = HTTPValidationError;

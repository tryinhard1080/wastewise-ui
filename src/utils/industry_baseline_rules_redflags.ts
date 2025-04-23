[
  {
    "field": "contract_term",
    "label": "Contract Term (Months)",
    "expected_range": [12, 36],
    "fail_if_over": 36,
    "fail_if_under": 12,
    "severity": "high",
    "message": "Contract term exceeds preferred 3-year maximum"
  },
  {
    "field": "termination_notice_period",
    "label": "Termination Notice Period (Days)",
    "expected_max": 60,
    "fail_if_over": 90,
    "severity": "medium",
    "message": "Termination notice exceeds 90 days"
  },
  {
    "field": "cpi_cap",
    "label": "CPI Cap (%)",
    "expected_max": 4,
    "fail_if_over": 5,
    "severity": "medium",
    "message": "CPI escalation exceeds 5%"
  },
  {
    "field": "auto_renewal_clause",
    "label": "Auto Renewal Clause Present",
    "expected_value": false,
    "fail_if_true": true,
    "severity": "high",
    "message": "Auto-renewal clause should be removed or limited"
  },
  {
    "field": "fuel_surcharge",
    "label": "Fuel Surcharge Policy",
    "expected_value": "Fixed or capped",
    "fail_if_missing": true,
    "severity": "medium",
    "message": "No clear policy for fuel surcharge"
  }
]

// ui/src/utils/industry_baseline_rules_redflags.ts

import { useState } from "react";

const OHIO_RED = "#C8102E";
const OHIO_RED_LIGHT = "#fdf2f4";
const OHIO_GRAY = "#4a4a4a";
const OHIO_LIGHT = "#f5f5f5";
const OHIO_BORDER = "#d9d9d9";

const STEPS = [
  { id: 1, label: "Applicant", title: "Applicant Information" },
  { id: 2, label: "Property", title: "Property Details" },
  { id: 3, label: "Exemption", title: "Exemption Request" },
  { id: 4, label: "Declaration", title: "Declaration & Signature" },
  { id: 5, label: "Review", title: "Review & Submit" },
];

const ORC_SECTIONS = [
  { code: "725.02", label: "§725.02" },
  { code: "1728.10", label: "§1728.10" },
  { code: "5709.40B", label: "§5709.40(B)" },
  { code: "5709.40C", label: "§5709.40(C)" },
  { code: "5709.41", label: "§5709.41" },
  { code: "5709.62", label: "§5709.62" },
  { code: "5709.63", label: "§5709.63" },
  { code: "5709.71", label: "§5709.71" },
  { code: "5709.73B", label: "§5709.73(B)" },
  { code: "5709.73C", label: "§5709.73(C)" },
  { code: "5709.78A", label: "§5709.78(A)" },
  { code: "5709.78B", label: "§5709.78(B)" },
  { code: "5709.88", label: "§5709.88" },
];

const initialForm = {
  applicantName: "",
  noticeName: "",
  noticeAddress: "",
  noticeCity: "",
  noticeState: "OH",
  noticeZip: "",
  noticePhone: "",
  email: "",
  countyName: "",
  parcels: ["", "", "", ""],
  schoolDistrict: "",
  propertyAddress: "",
  titleHolderName: "",
  titleHolderAddress: "",
  dateTitleAcquired: "",
  titleDifferentExplanation: "",
  orcSections: [],
  orcOther: "",
  incentiveDetails: "",
  hasResolution: false,
  hasSchoolApproval: false,
  tifFiling: "",
  sigName: "",
  sigTitle: "",
  sigAddress: "",
  sigCity: "",
  sigState: "OH",
  sigZip: "",
  sigPhone: "",
  sigDate: "",
};

// Transforms flat form state into a structured, labelled JSON
function buildSubmissionJSON(form) {
  return {
    form_metadata: {
      form_number: "DTE 24",
      form_title: "Tax Incentive Program – Application for Real Property Tax Exemption and Remission",
      revision: "01/19",
      submitted_at: new Date().toISOString(),
      submission_id: `DTE24-${Date.now()}`,
    },
    applicant: {
      name: form.applicantName,
      notices_contact: {
        name: form.noticeName || form.applicantName,
        address: form.noticeAddress,
        city: form.noticeCity,
        state: form.noticeState,
        zip: form.noticeZip,
        phone: form.noticePhone,
        email: form.email,
      },
      county: form.countyName,
    },
    property: {
      parcel_numbers: form.parcels.filter(Boolean),
      school_district: form.schoolDistrict,
      property_address: form.propertyAddress,
      title: {
        holder_name: form.titleHolderName,
        holder_address: form.titleHolderAddress,
        date_acquired: form.dateTitleAcquired,
        difference_explanation: form.titleDifferentExplanation || null,
      },
    },
    exemption_request: {
      orc_sections: form.orcSections.map(code => ({
        code,
        label: ORC_SECTIONS.find(o => o.code === code)?.label,
      })),
      orc_other: form.orcOther || null,
      incentive_details: form.incentiveDetails,
      supporting_documents: {
        resolution_or_ordinance_attached: form.hasResolution,
        school_district_approval_attached: form.hasSchoolApproval,
      },
      tif_filing: form.tifFiling
        ? {
            filing_type: form.tifFiling,
            filing_type_label:
              form.tifFiling === "owner" ? "By property owner" :
              form.tifFiling === "no_consent" ? "By political subdivision without owner consent" :
              "By political subdivision with owner consent (DTE Form 24P attached)",
          }
        : null,
    },
    declaration: {
      signatory_name: form.sigName,
      signatory_title: form.sigTitle,
      address: form.sigAddress,
      city: form.sigCity,
      state: form.sigState,
      zip: form.sigZip,
      phone: form.sigPhone,
      date_signed: form.sigDate,
    },
  };
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function Field({ label, required, children, hint }) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: OHIO_GRAY, marginBottom: "0.35rem", fontFamily: "Arial, sans-serif" }}>
        {label}{required && <span style={{ color: OHIO_RED, marginLeft: 3 }}>*</span>}
      </label>
      {hint && <p style={{ fontSize: "0.75rem", color: "#777", marginBottom: "0.35rem", marginTop: 0, fontStyle: "italic" }}>{hint}</p>}
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ width: "100%", padding: "0.55rem 0.75rem", fontSize: "0.9rem", fontFamily: "Arial, sans-serif",
        border: `1px solid ${focused ? OHIO_RED : "#aaa"}`, borderRadius: "3px", outline: "none",
        background: "#fff", color: "#1a1a1a", boxSizing: "border-box",
        boxShadow: focused ? `0 0 0 2px rgba(200,16,46,0.12)` : "none", transition: "border-color 0.15s" }} />
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ width: "100%", padding: "0.55rem 0.75rem", fontSize: "0.9rem", fontFamily: "Arial, sans-serif",
        border: `1px solid ${focused ? OHIO_RED : "#aaa"}`, borderRadius: "3px", outline: "none",
        background: "#fff", color: "#1a1a1a", boxSizing: "border-box", resize: "vertical",
        boxShadow: focused ? `0 0 0 2px rgba(200,16,46,0.12)` : "none", transition: "border-color 0.15s" }} />
  );
}

function Row({ children, cols = 2 }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "1rem" }}>{children}</div>;
}

function SectionHeading({ children }) {
  return (
    <div style={{ borderBottom: `2px solid ${OHIO_RED}`, paddingBottom: "0.4rem", marginBottom: "1rem", marginTop: "1.5rem" }}>
      <h3 style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: OHIO_RED, fontFamily: "Arial, sans-serif" }}>{children}</h3>
    </div>
  );
}

function ReviewRow({ label, value }) {
  if (!value && value !== false) return null;
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${OHIO_BORDER}`, padding: "0.55rem 0", gap: "1rem" }}>
      <span style={{ flex: "0 0 200px", fontSize: "0.78rem", fontWeight: 700, color: OHIO_GRAY, fontFamily: "Arial, sans-serif" }}>{label}</span>
      <span style={{ fontSize: "0.88rem", color: "#1a1a1a", fontFamily: "Arial, sans-serif", flex: 1 }}>{String(value)}</span>
    </div>
  );
}

function OhioShield() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="17" fill="white" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
      <text x="18" y="24" textAnchor="middle" fontSize="18" fontWeight="bold" fill={OHIO_RED} fontFamily="Arial">O</text>
    </svg>
  );
}

export default function DTE24App() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [jsonExpanded, setJsonExpanded] = useState(false);

  const set = (field) => (val) => setForm(f => ({ ...f, [field]: val }));
  const toggleOrc = (code) => setForm(f => ({ ...f, orcSections: f.orcSections.includes(code) ? f.orcSections.filter(c => c !== code) : [...f.orcSections, code] }));
  const setParcel = (i, val) => { const p = [...form.parcels]; p[i] = val; setForm(f => ({ ...f, parcels: p })); };

  const handleSubmit = () => {
    const json = buildSubmissionJSON(form);
    setSubmissionData(json);
    setSubmitted(true);
  };

  if (submitted && submissionData) {
    const filename = `DTE24_${submissionData.form_metadata.submission_id}.json`;
    return (
      <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", background: OHIO_LIGHT }}>
        <div style={{ background: "#333", padding: "0.35rem 1.5rem", fontSize: "0.72rem", color: "#ccc" }}>🔒 An official State of Ohio site.</div>
        <div style={{ background: OHIO_RED, padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <OhioShield />
          <div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Ohio Department of Taxation</div>
            <div style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700 }}>DTE 24 — Real Property Tax Exemption</div>
          </div>
        </div>

        <div style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1.5rem" }}>
          {/* Success card */}
          <div style={{ background: "#fff", border: `1px solid ${OHIO_BORDER}`, borderTop: "4px solid #2e7d32", borderRadius: "2px", padding: "2rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <div style={{ fontSize: "2.5rem", lineHeight: 1 }}>✅</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ color: "#2e7d32", fontSize: "1.3rem", margin: "0 0 0.5rem", fontWeight: 700 }}>Application Submitted Successfully</h2>
                <p style={{ color: OHIO_GRAY, fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 0.25rem" }}>
                  DTE 24 application for <strong>{form.countyName} County</strong> has been recorded.
                </p>
                <p style={{ color: "#888", fontSize: "0.8rem", margin: 0 }}>
                  Submission ID: <code style={{ background: "#f5f5f5", padding: "0.1rem 0.4rem", borderRadius: "2px", fontSize: "0.78rem" }}>{submissionData.form_metadata.submission_id}</code>
                </p>
              </div>
            </div>
          </div>

          {/* JSON download card */}
          <div style={{ background: "#fff", border: `1px solid ${OHIO_BORDER}`, borderTop: `3px solid ${OHIO_RED}`, borderRadius: "2px", marginBottom: "1.5rem" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: `1px solid ${OHIO_BORDER}`, background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#1a1a1a" }}>📄 JSON Data Export</h3>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.78rem", color: "#777" }}>
                  Structured data ready for Salesforce, APIs, or any backend system
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => setJsonExpanded(v => !v)}
                  style={{ padding: "0.5rem 1rem", border: `1px solid ${OHIO_BORDER}`, borderRadius: "3px", background: "#fff", color: OHIO_GRAY, fontFamily: "Arial, sans-serif", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}>
                  {jsonExpanded ? "Hide JSON" : "Preview JSON"}
                </button>
                <button
                  onClick={() => downloadJSON(submissionData, filename)}
                  style={{ padding: "0.5rem 1rem", border: "none", borderRadius: "3px", background: OHIO_RED, color: "#fff", fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  ⬇ Download .json
                </button>
              </div>
            </div>

            {jsonExpanded && (
              <div style={{ padding: "1rem 1.5rem" }}>
                <pre style={{
                  margin: 0,
                  padding: "1rem",
                  background: "#1e1e1e",
                  color: "#d4d4d4",
                  borderRadius: "3px",
                  fontSize: "0.75rem",
                  lineHeight: 1.6,
                  overflowX: "auto",
                  fontFamily: "'Courier New', monospace",
                  maxHeight: "420px",
                  overflowY: "auto"
                }}>
                  {JSON.stringify(submissionData, null, 2)
                    .split("\n")
                    .map((line, i) => {
                      const keyMatch = line.match(/^(\s*)("[\w_]+"):/);
                      const valIsString = line.match(/:\s*"[^"]*"/);
                      const valIsNum = line.match(/:\s*\d/);
                      const valIsBool = line.match(/:\s*(true|false)/);
                      if (keyMatch) {
                        return <span key={i}><span style={{ color: "#9cdcfe" }}>{line.match(/"[\w_]+"/)[0]}</span>{line.slice(keyMatch[0].length - keyMatch[1].length + keyMatch[1].length)}{"\n"}</span>;
                      }
                      return <span key={i}>{line}{"\n"}</span>;
                    })}
                </pre>
                <p style={{ margin: "0.75rem 0 0", fontSize: "0.75rem", color: "#888" }}>
                  This JSON structure maps directly to Salesforce field names or any REST API. A developer can configure automatic posting to Salesforce on submission.
                </p>
              </div>
            )}
          </div>

          {/* What the JSON contains */}
          <div style={{ background: "#fff", border: `1px solid ${OHIO_BORDER}`, borderRadius: "2px", padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
            <h3 style={{ margin: "0 0 0.75rem", fontSize: "0.9rem", fontWeight: 700, color: "#1a1a1a" }}>What's in the JSON?</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {[
                ["form_metadata", "Form ID, submission timestamp, revision"],
                ["applicant", "Name, contact info, county"],
                ["property", "Parcels, school district, title details"],
                ["exemption_request", "ORC sections, TIF type, incentive terms"],
                ["declaration", "Signatory name, title, date signed"],
              ].map(([key, desc]) => (
                <div key={key} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <code style={{ background: "#f5f5f5", padding: "0.1rem 0.45rem", borderRadius: "2px", fontSize: "0.75rem", color: OHIO_RED, fontFamily: "'Courier New', monospace", flexShrink: 0 }}>{key}</code>
                  <span style={{ fontSize: "0.78rem", color: "#666" }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Important notice */}
          <div style={{ background: "#fff8e1", border: "1px solid #f9a825", borderLeft: "4px solid #f9a825", borderRadius: "2px", padding: "0.9rem 1rem", marginBottom: "1.5rem", fontSize: "0.8rem", color: "#4a3000", lineHeight: 1.6 }}>
            <strong>Important:</strong> You must still submit two physical copies of the DTE 24 to the county auditor's office by <strong>December 31</strong> of the year for which exemption is sought.
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => downloadJSON(submissionData, filename)}
              style={{ flex: 1, padding: "0.7rem", border: "none", borderRadius: "3px", background: OHIO_RED, color: "#fff", fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}>
              ⬇ Download JSON File
            </button>
            <button onClick={() => { setSubmitted(false); setStep(1); setForm(initialForm); setSubmissionData(null); }}
              style={{ flex: 1, padding: "0.7rem", border: `1px solid ${OHIO_BORDER}`, borderRadius: "3px", background: "#fff", color: OHIO_GRAY, fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}>
              Start New Application
            </button>
          </div>
        </div>

        <div style={{ background: "#333", marginTop: "2rem", padding: "1.25rem 1.5rem" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", color: "#ccc", fontSize: "0.78rem" }}>
            <span style={{ color: "#fff", fontWeight: 700 }}>Ohio Department of Taxation</span> · Tax Equalization Division · P.O. Box 530, Columbus, OH 43216-0530
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", background: OHIO_LIGHT }}>
      {/* Official Ohio gov banner */}
      <div style={{ background: "#333", color: "#ccc", fontSize: "0.72rem", borderBottom: "1px solid #555" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "0.35rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>🔒 An official State of Ohio site.</span>
          <button onClick={() => setBannerOpen(o => !o)} style={{ background: "none", border: "none", color: "#aaa", fontSize: "0.72rem", cursor: "pointer", textDecoration: "underline", padding: 0 }}>
            Here's how you know {bannerOpen ? "▲" : "▼"}
          </button>
        </div>
        {bannerOpen && (
          <div style={{ background: "#222", padding: "0.75rem 1.5rem", maxWidth: 980, margin: "0 auto", fontSize: "0.75rem", color: "#bbb", lineHeight: 1.6 }}>
            Official websites use Ohio.gov. An Ohio.gov website belongs to an official government organization in the State of Ohio.
          </div>
        )}
      </div>

      {/* Red header */}
      <div style={{ background: OHIO_RED }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <OhioShield />
          <div style={{ flex: 1 }}>
            <div style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>Ohio Department of Taxation</div>
            <div style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, lineHeight: 1.2 }}>Tax Incentive Program</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.65rem" }}>Form Number</div>
            <div style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700 }}>DTE 24</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.63rem" }}>Rev. 01/19</div>
          </div>
        </div>
      </div>

      {/* Page subtitle */}
      <div style={{ background: "#fff", borderBottom: `3px solid ${OHIO_BORDER}` }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "0.7rem 1.5rem" }}>
          <h1 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#1a1a1a" }}>Application for Real Property Tax Exemption and Remission</h1>
          <p style={{ margin: "0.2rem 0 0", fontSize: "0.78rem", color: "#666" }}>
            Submit two copies to the county auditor's office where the property is located by December 31 of the year for which exemption is sought.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "1.5rem auto", padding: "0 1.5rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>

        {/* Sidebar */}
        <div style={{ flex: "0 0 190px", background: "#fff", border: `1px solid ${OHIO_BORDER}`, borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ background: OHIO_RED, padding: "0.65rem 1rem" }}>
            <div style={{ color: "#fff", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Application Steps</div>
          </div>
          {STEPS.map(s => (
            <div key={s.id} onClick={() => s.id < step && setStep(s.id)} style={{
              padding: "0.7rem 1rem", borderBottom: `1px solid ${OHIO_BORDER}`,
              background: step === s.id ? OHIO_RED_LIGHT : "#fff",
              cursor: s.id < step ? "pointer" : "default",
              display: "flex", alignItems: "center", gap: "0.6rem",
              borderLeft: step === s.id ? `3px solid ${OHIO_RED}` : "3px solid transparent",
            }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: step > s.id ? "#2e7d32" : step === s.id ? OHIO_RED : "#ddd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: step >= s.id ? "#fff" : "#888" }}>
                {step > s.id ? "✓" : s.id}
              </div>
              <span style={{ fontSize: "0.82rem", fontWeight: step === s.id ? 700 : 400, color: step === s.id ? OHIO_RED : step > s.id ? "#444" : "#888" }}>{s.label}</span>
            </div>
          ))}
          <div style={{ padding: "0.75rem 1rem", background: "#fafafa" }}>
            <div style={{ fontSize: "0.7rem", color: "#999", marginBottom: "0.4rem" }}>Progress</div>
            <div style={{ background: "#e0e0e0", borderRadius: 2, height: 5 }}>
              <div style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%`, height: "100%", background: OHIO_RED, borderRadius: 2, transition: "width 0.4s" }} />
            </div>
            <div style={{ fontSize: "0.7rem", color: "#999", marginTop: "0.35rem" }}>Step {step} of {STEPS.length}</div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1 }}>
          <div style={{ background: "#fff", border: `1px solid ${OHIO_BORDER}`, borderTop: `3px solid ${OHIO_RED}`, borderRadius: "2px" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: `1px solid ${OHIO_BORDER}`, background: "#fafafa" }}>
              <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#1a1a1a" }}>{STEPS.find(s => s.id === step)?.title}</h2>
            </div>

            <div style={{ padding: "1.25rem 1.5rem" }}>

              {step === 1 && (
                <div>
                  <SectionHeading>Applicant</SectionHeading>
                  <Field label="Applicant Name" required><Input value={form.applicantName} onChange={set("applicantName")} placeholder="Full legal name of applicant" /></Field>
                  <SectionHeading>Notices — Contact Information</SectionHeading>
                  <p style={{ fontSize: "0.8rem", color: "#666", marginTop: 0, marginBottom: "1rem", lineHeight: 1.5 }}>If the county auditor has your email address, they may send notices by email and regular mail instead of certified mail.</p>
                  <Field label="Name (if different from applicant)"><Input value={form.noticeName} onChange={set("noticeName")} placeholder="Leave blank if same as applicant" /></Field>
                  <Field label="Address" required><Input value={form.noticeAddress} onChange={set("noticeAddress")} placeholder="Street address" /></Field>
                  <Row cols={3}>
                    <Field label="City" required><Input value={form.noticeCity} onChange={set("noticeCity")} placeholder="City" /></Field>
                    <Field label="State"><Input value={form.noticeState} onChange={set("noticeState")} placeholder="OH" /></Field>
                    <Field label="ZIP Code" required><Input value={form.noticeZip} onChange={set("noticeZip")} placeholder="ZIP" /></Field>
                  </Row>
                  <Row>
                    <Field label="Telephone Number"><Input value={form.noticePhone} onChange={set("noticePhone")} placeholder="(000) 000-0000" type="tel" /></Field>
                    <Field label="Email Address" required><Input value={form.email} onChange={set("email")} placeholder="email@example.com" type="email" /></Field>
                  </Row>
                  <SectionHeading>County</SectionHeading>
                  <Field label="County Name" required hint="County where the property is located"><Input value={form.countyName} onChange={set("countyName")} placeholder="e.g. Franklin, Cuyahoga, Hamilton" /></Field>
                  <div style={{ background: "#e8f4fd", border: "1px solid #90caf9", borderLeft: "4px solid #1565c0", borderRadius: "2px", padding: "0.8rem 1rem", marginTop: "1rem", fontSize: "0.8rem", color: "#1565c0", lineHeight: 1.5 }}>
                    Fields marked <span style={{ color: OHIO_RED }}>*</span> are required. If you need assistance, contact your county auditor.
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <SectionHeading>Parcel Numbers (Question 1)</SectionHeading>
                  <p style={{ fontSize: "0.8rem", color: "#666", marginTop: 0, marginBottom: "1rem", lineHeight: 1.5 }}>All parcels must be in the same school district. Attach additional sheets if more than four.</p>
                  <Row>{[0,1].map(i => <Field key={i} label={`Parcel ${i+1}`}><Input value={form.parcels[i]} onChange={v => setParcel(i,v)} placeholder="Parcel number" /></Field>)}</Row>
                  <Row>{[2,3].map(i => <Field key={i} label={`Parcel ${i+1} (optional)`}><Input value={form.parcels[i]} onChange={v => setParcel(i,v)} placeholder="Parcel number" /></Field>)}</Row>
                  <SectionHeading>School & Location (Questions 2 & 3)</SectionHeading>
                  <Field label="School District Where Located" required><Input value={form.schoolDistrict} onChange={set("schoolDistrict")} placeholder="School district name" /></Field>
                  <Field label="Street Address or Location of Property" required><Input value={form.propertyAddress} onChange={set("propertyAddress")} placeholder="Street address or legal description" /></Field>
                  <SectionHeading>Title Information (Questions 4 & 5)</SectionHeading>
                  <Field label="Title to this property is in the name of" required hint="Question 4a"><Input value={form.titleHolderName} onChange={set("titleHolderName")} placeholder="Full legal name of title holder" /></Field>
                  <Field label="Address of Owner" hint="Question 4b"><Input value={form.titleHolderAddress} onChange={set("titleHolderAddress")} placeholder="Owner's mailing address" /></Field>
                  <Field label="Date Title Was Acquired" required hint="Question 5"><Input value={form.dateTitleAcquired} onChange={set("dateTitleAcquired")} type="date" /></Field>
                  <Field label="If title holder is different from applicant, please explain" hint="Question 6">
                    <Textarea value={form.titleDifferentExplanation} onChange={set("titleDifferentExplanation")} placeholder="Explain the relationship between applicant and title holder..." rows={3} />
                  </Field>
                </div>
              )}

              {step === 3 && (
                <div>
                  <SectionHeading>ORC Section(s) for Exemption (Question 7)</SectionHeading>
                  <p style={{ fontSize: "0.8rem", color: "#666", marginTop: 0, marginBottom: "1rem", lineHeight: 1.5 }}>Select all sections of the Ohio Revised Code under which exemption is sought.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.45rem", marginBottom: "1rem" }}>
                    {ORC_SECTIONS.map(orc => {
                      const checked = form.orcSections.includes(orc.code);
                      return (
                        <div key={orc.code} onClick={() => toggleOrc(orc.code)} style={{ padding: "0.5rem 0.7rem", border: `1px solid ${checked ? OHIO_RED : OHIO_BORDER}`, borderRadius: "3px", background: checked ? OHIO_RED_LIGHT : "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.45rem", userSelect: "none", transition: "all 0.12s" }}>
                          <div style={{ width: 14, height: 14, border: `2px solid ${checked ? OHIO_RED : "#bbb"}`, borderRadius: "2px", background: checked ? OHIO_RED : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.58rem", color: "#fff", fontWeight: 700 }}>{checked ? "✓" : ""}</div>
                          <span style={{ fontSize: "0.8rem", fontWeight: checked ? 700 : 400, color: checked ? OHIO_RED : "#444" }}>{orc.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  <Field label="Other incentive program — specify R.C. section"><Input value={form.orcOther} onChange={set("orcOther")} placeholder="R.C. section number" /></Field>
                  <SectionHeading>Incentive Details (Question 8)</SectionHeading>
                  <Field label="Explain terms and details of incentive" required hint="Include: real property included, percentage exempted, number of years, etc.">
                    <Textarea value={form.incentiveDetails} onChange={set("incentiveDetails")} placeholder="Describe the incentive terms in detail..." rows={5} />
                  </Field>
                  <SectionHeading>Supporting Documents (Question 9)</SectionHeading>
                  {[
                    { key: "hasResolution", label: "9a — Resolution or ordinance of the subdivision granting the incentive and/or the applicant's incentive agreement is attached." },
                    { key: "hasSchoolApproval", label: "9b — School district approval (if required) is attached." }
                  ].map(item => (
                    <div key={item.key} onClick={() => set(item.key)(!form[item.key])} style={{ padding: "0.75rem 1rem", border: `1px solid ${form[item.key] ? "#2e7d32" : OHIO_BORDER}`, borderRadius: "3px", background: form[item.key] ? "#f1f8e9" : "#fff", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.5rem", userSelect: "none", transition: "all 0.12s" }}>
                      <div style={{ width: 15, height: 15, border: `2px solid ${form[item.key] ? "#2e7d32" : "#bbb"}`, borderRadius: "2px", background: form[item.key] ? "#2e7d32" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, fontSize: "0.6rem", color: "#fff", fontWeight: 700 }}>{form[item.key] ? "✓" : ""}</div>
                      <span style={{ fontSize: "0.85rem", color: "#333", lineHeight: 1.5 }}>{item.label}</span>
                    </div>
                  ))}
                  <SectionHeading>Tax Increment Financing (Question 10)</SectionHeading>
                  <p style={{ fontSize: "0.8rem", color: "#666", marginTop: 0, marginBottom: "0.75rem", lineHeight: 1.5 }}>If this application requests a TIF exemption, indicate how it is being filed.</p>
                  {[
                    { val: "owner", label: "By the property owner" },
                    { val: "no_consent", label: "By the political subdivision without owner consent" },
                    { val: "with_consent", label: "By the political subdivision with owner consent (attach DTE Form 24P)" }
                  ].map(opt => (
                    <div key={opt.val} onClick={() => set("tifFiling")(opt.val)} style={{ padding: "0.65rem 1rem", border: `1px solid ${form.tifFiling === opt.val ? OHIO_RED : OHIO_BORDER}`, borderRadius: "3px", background: form.tifFiling === opt.val ? OHIO_RED_LIGHT : "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.45rem", userSelect: "none", transition: "all 0.12s" }}>
                      <div style={{ width: 14, height: 14, border: `2px solid ${form.tifFiling === opt.val ? OHIO_RED : "#bbb"}`, borderRadius: "50%", background: form.tifFiling === opt.val ? OHIO_RED : "#fff", flexShrink: 0, position: "relative" }}>
                        {form.tifFiling === opt.val && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />}
                      </div>
                      <span style={{ fontSize: "0.85rem", color: "#333" }}>{opt.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {step === 4 && (
                <div>
                  <div style={{ background: "#fff8e1", border: "1px solid #f9a825", borderLeft: "4px solid #f9a825", borderRadius: "2px", padding: "1rem 1.25rem", marginBottom: "1.5rem", fontSize: "0.82rem", color: "#4a3000", lineHeight: 1.7 }}>
                    <strong>Declaration:</strong> Application is hereby made to have the aforementioned property placed on the tax-exempt list pursuant to the authorizing agreement, ordinance or resolution, and the limitations in the Ohio Revised Code. I declare under penalty of perjury that I have examined this application and, to the best of my knowledge and belief, it is true, correct and complete.
                  </div>
                  <SectionHeading>Applicant or Representative</SectionHeading>
                  <Row>
                    <Field label="Print Name" required><Input value={form.sigName} onChange={set("sigName")} placeholder="Full printed name" /></Field>
                    <Field label="Title / Role"><Input value={form.sigTitle} onChange={set("sigTitle")} placeholder="e.g. Owner, Attorney, Agent" /></Field>
                  </Row>
                  <Field label="Address"><Input value={form.sigAddress} onChange={set("sigAddress")} placeholder="Street address" /></Field>
                  <Row cols={3}>
                    <Field label="City"><Input value={form.sigCity} onChange={set("sigCity")} placeholder="City" /></Field>
                    <Field label="State"><Input value={form.sigState} onChange={set("sigState")} placeholder="OH" /></Field>
                    <Field label="ZIP Code"><Input value={form.sigZip} onChange={set("sigZip")} placeholder="ZIP" /></Field>
                  </Row>
                  <Row>
                    <Field label="Telephone Number"><Input value={form.sigPhone} onChange={set("sigPhone")} placeholder="(000) 000-0000" type="tel" /></Field>
                    <Field label="Date" required><Input value={form.sigDate} onChange={set("sigDate")} type="date" /></Field>
                  </Row>
                  <div style={{ background: "#e8f4fd", border: "1px solid #90caf9", borderLeft: "4px solid #1565c0", borderRadius: "2px", padding: "0.9rem 1rem", marginTop: "1rem", fontSize: "0.8rem", color: "#1565c0", lineHeight: 1.6 }}>
                    <strong>Office Use Only — Pages 3 & 4:</strong> The County Auditor's Finding and Treasurer's Certificate are completed by county offices and are separate from this digital form.
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <p style={{ fontSize: "0.85rem", color: "#555", marginTop: 0, marginBottom: "1.25rem", lineHeight: 1.5 }}>
                    Review all information below. Click any completed step in the left sidebar to make changes.
                  </p>
                  <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderLeft: "4px solid #2e7d32", borderRadius: "2px", padding: "0.8rem 1rem", marginBottom: "1.25rem", fontSize: "0.8rem", color: "#14532d", lineHeight: 1.5 }}>
                    <strong>📄 On submission</strong>, a JSON file will be generated containing all form data — ready for download and Salesforce integration.
                  </div>
                  <SectionHeading>Applicant & Contact</SectionHeading>
                  <ReviewRow label="Applicant Name" value={form.applicantName} />
                  <ReviewRow label="Notice Name" value={form.noticeName || "(same as applicant)"} />
                  <ReviewRow label="Mailing Address" value={[form.noticeAddress, form.noticeCity, form.noticeState, form.noticeZip].filter(Boolean).join(", ")} />
                  <ReviewRow label="Phone" value={form.noticePhone} />
                  <ReviewRow label="Email" value={form.email} />
                  <ReviewRow label="County" value={form.countyName} />
                  <SectionHeading>Property</SectionHeading>
                  <ReviewRow label="Parcel Number(s)" value={form.parcels.filter(Boolean).join(", ")} />
                  <ReviewRow label="School District" value={form.schoolDistrict} />
                  <ReviewRow label="Property Address" value={form.propertyAddress} />
                  <ReviewRow label="Title Holder" value={form.titleHolderName} />
                  <ReviewRow label="Title Holder Address" value={form.titleHolderAddress} />
                  <ReviewRow label="Date Acquired" value={form.dateTitleAcquired} />
                  {form.titleDifferentExplanation && <ReviewRow label="Title Explanation" value={form.titleDifferentExplanation} />}
                  <SectionHeading>Exemption Request</SectionHeading>
                  <ReviewRow label="ORC Section(s)" value={form.orcSections.length ? form.orcSections.map(c => ORC_SECTIONS.find(o => o.code === c)?.label).join(", ") : "None selected"} />
                  {form.orcOther && <ReviewRow label="Other ORC Section" value={form.orcOther} />}
                  <ReviewRow label="Incentive Details" value={form.incentiveDetails} />
                  <ReviewRow label="Resolution Attached" value={form.hasResolution ? "Yes" : "No"} />
                  <ReviewRow label="School Approval Attached" value={form.hasSchoolApproval ? "Yes" : "No"} />
                  <ReviewRow label="TIF Filing" value={form.tifFiling === "owner" ? "By property owner" : form.tifFiling === "no_consent" ? "By political subdivision (no owner consent)" : form.tifFiling === "with_consent" ? "By political subdivision (with owner consent)" : "Not applicable"} />
                  <SectionHeading>Declaration</SectionHeading>
                  <ReviewRow label="Printed Name" value={form.sigName} />
                  <ReviewRow label="Title" value={form.sigTitle} />
                  <ReviewRow label="Address" value={[form.sigAddress, form.sigCity, form.sigState, form.sigZip].filter(Boolean).join(", ")} />
                  <ReviewRow label="Phone" value={form.sigPhone} />
                  <ReviewRow label="Date Signed" value={form.sigDate} />
                </div>
              )}
            </div>

            {/* Nav footer */}
            <div style={{ padding: "1rem 1.5rem", borderTop: `1px solid ${OHIO_BORDER}`, background: "#fafafa", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} style={{ padding: "0.6rem 1.4rem", border: `1px solid ${step === 1 ? OHIO_BORDER : "#999"}`, borderRadius: "3px", background: "#fff", color: step === 1 ? "#ccc" : OHIO_GRAY, fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: "0.875rem", cursor: step === 1 ? "not-allowed" : "pointer" }}>
                ← Previous
              </button>
              <span style={{ fontSize: "0.75rem", color: "#999" }}>Step {step} of {STEPS.length}</span>
              {step < STEPS.length ? (
                <button onClick={() => setStep(s => Math.min(STEPS.length, s + 1))} style={{ padding: "0.6rem 1.6rem", border: "none", borderRadius: "3px", background: OHIO_RED, color: "#fff", fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}>
                  Next →
                </button>
              ) : (
                <button onClick={handleSubmit} style={{ padding: "0.6rem 1.6rem", border: "none", borderRadius: "3px", background: "#2e7d32", color: "#fff", fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}>
                  Submit & Generate JSON ✓
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#333", marginTop: "2rem", padding: "1.25rem 1.5rem" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ color: "#ccc", fontSize: "0.78rem" }}>
            <span style={{ color: "#fff", fontWeight: 700 }}>Ohio Department of Taxation</span> · Tax Equalization Division<br />
            P.O. Box 530, Columbus, OH 43216-0530 · DTE 24 Rev. 01/19
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy Notice", "ADA Accessibility", "Ohio.gov"].map(l => (
              <span key={l} style={{ color: "#aaa", fontSize: "0.75rem", cursor: "pointer", textDecoration: "underline" }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

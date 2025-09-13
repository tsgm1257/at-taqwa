import { Schema, model, models } from "mongoose";

const LineItemSchema = new Schema(
  {
    category: { type: String, required: true }, // e.g., "Donations", "Event Expense"
    amount: { type: Number, required: true, min: 0 },
    note: { type: String },
  },
  { _id: false }
);

const ReportSchema = new Schema(
  {
    title: { type: String, required: true },
    month: { type: String, required: true, index: true }, // "YYYY-MM" unique per month
    currency: { type: String, default: "BDT" },

    openingBalance: { type: Number, default: 0, min: 0 },

    income: { type: [LineItemSchema], default: [] },
    expense: { type: [LineItemSchema], default: [] },

    totalIncome: { type: Number, default: 0, min: 0 },
    totalExpense: { type: Number, default: 0, min: 0 },
    closingBalance: { type: Number, default: 0, min: 0 },

    summary: { type: String },          // optional text summary shown on the page
    published: { type: Boolean, default: true },

    preparedBy: { type: String },       // e.g., admin email/name
    // optional: attachments like PDF if you want in the future
    // attachments: [{ label: String, url: String }]
  },
  { timestamps: true }
);

ReportSchema.index({ month: 1 }, { unique: true });

// ensure totals are correct before save
ReportSchema.pre("save", function (next) {
  const totalIncome = (this.income || []).reduce(
    (s: number, i: { amount?: number }) => s + (i.amount || 0),
    0
  );
  const totalExpense = (this.expense || []).reduce(
    (s: number, i: { amount?: number }) => s + (i.amount || 0),
    0
  );
  this.totalIncome = totalIncome;
  this.totalExpense = totalExpense;
  const closing = (this.openingBalance || 0) + totalIncome - totalExpense;
  this.closingBalance = Math.max(0, closing);
  next();
});

export default models.Report || model("Report", ReportSchema);

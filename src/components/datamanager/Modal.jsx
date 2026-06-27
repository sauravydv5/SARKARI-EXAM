import React from "react";

const Modal = ({ visible, title, children, footer, onClose }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-[95vw] md:max-w-[80vw] lg:max-w-[1200px] max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-5">
          {children}
        </div>

        {footer && (
          <div className="sticky bottom-0 border-t border-slate-200 bg-white px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

import React from "react";

const ContactsForm = () => {
  return (
    <div className="flex flex-col bg-secondary/5 gap-4 px-6 py-4 rounded-base">
      <label>
        <h2 className="border-underline-2 font-semibold text-tertiary-text">
          Full Name:
        </h2>
        <input
          className="bg-secondary/8 focus:outline-2 focus:outline-accent p-2 rounded-base w-full mt-4"
          type="text"
          name="full_name"
          placeholder="Ivanov Petr"
        />
      </label>
      <label>
        <h2 className="border-underline-2 font-semibold text-tertiary-text">
          E-mail:
        </h2>
        <input
          className="bg-secondary/8 focus:outline-2 focus:outline-accent p-2 rounded-base w-full mt-4"
          type="email"
          name="email"
          placeholder="ivanovpetr@yandex.ru"
        />
      </label>
      <label>
        <h2 className="border-underline-2 font-semibold text-tertiary-text">
          Your question:
        </h2>
        <textarea
          className="w-full bg-secondary/8 focus:outline-2 focus:outline-accent p-2 rounded-base mt-4"
          rows={10}
          name="question"
        ></textarea>
      </label>
      <button className="bg-secondary hover:bg-secondary/90 cursor-pointer text-secondary-text w-full p-2 rounded-base">
        Submit
      </button>
    </div>
  );
};

export default ContactsForm;

import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const MyForm = () => {
  const backend_Url = ""
  const [filterTypeOptions, setFilterTypeOptions] = useState([
    "Option 1",
    "Option 2",
    "Option 3",
  ]);

  const [formData, setFormData] = useState({
    filter_type: "",
    filter_value: "",
    start_date: "",
    end_date: "",
    stt: "",
    ent: "",
    page_size: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const isFormValid = () =>
    Object.values(formData).every((value) => value !== "");

  const parseDateAndTime = (date, time) => new Date(`${date}T${time}`);

  const validateForm = () => {
    const errors = {};

    const validateField = (name, errorMessage) => {
      if (!formData[name]) {
        errors[name] = errorMessage;
      }
    };

    validateField("filter_type", "Please select a filter type");
    validateField("filter_value", "Please enter a filter value");
    validateField("start_date", "Please select a start date");
    validateField("stt", "Please select a start time");
    validateField("end_date", "Please select an end date");
    validateField("ent", "Please select an end time");
    validateField("page_size", "Please enter a page size");

    const startDateAndTime = parseDateAndTime(
      formData.start_date,
      formData.stt
    );
    const endDateAndTime = parseDateAndTime(formData.end_date, formData.ent);

    if (endDateAndTime <= startDateAndTime) {
      errors.end_date =
        "End date and time must be greater than start date and time";
      errors.ent = "End date and time must be greater than start date and time";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Make an HTTP POST request to your API endpoint
        const response = await axios.post(backend_Url, formData);
        console.log("Server response:", response.data);
      } catch (error) {
        console.error("Error submitting form:", error);
        // Handle error as needed
      }
    }
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const renderFormInputs = () => {
    const formFields = [
      { label: "Filter Type", name: "filter_type", type: "select" },
      { label: "Filter Value", name: "filter_value", type: "number" },
      { label: "Start Date", name: "start_date", type: "date" },
      { label: "Start Time", name: "stt", type: "time" },
      { label: "End Date", name: "end_date", type: "date" },
      { label: "End Time", name: "ent", type: "time" },
      { label: "Page Size", name: "page_size", type: "number" },
    ];

    return formFields.map((field, index) => (
      <Form.Group key={index} controlId={`form${field.name}`}>
        <Form.Label>{field.label}</Form.Label>
        {field.type === "select" ? (
          <Form.Control
            as="select"
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            isInvalid={!!formErrors[field.name]}
          >
            <option value="">Select {field.label}</option>
            {filterTypeOptions.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </Form.Control>
        ) : (
          <Form.Control
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            isInvalid={!!formErrors[field.name]}
          />
        )}
        <Form.Control.Feedback type="invalid">
          {formErrors[field.name]}
        </Form.Control.Feedback>
      </Form.Group>
    ));
  };

  return (
    <div className="app-background">
      <div className="form-container">
        <Form onSubmit={handleSubmit}>
          {renderFormInputs()}
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit" disabled={!isFormValid()}>
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default MyForm;

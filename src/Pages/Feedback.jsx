
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Heart, ArrowLeft } from "lucide-react";


//We define FEEDBACK_STORAGE_KEY to give the feedback data a fixed name (key) in localStorage, so we can easily identify, save, and retrieve it
export const FEEDBACK_STORAGE_KEY =
    "salt-customer-feedback";

//the job of this function is to retrieve the saved customer feedback from localStorage.
export const getFeedback = () => {
    try {
        const savedFeedback = JSON.parse(
            localStorage.getItem(FEEDBACK_STORAGE_KEY) || "[]"
        ); // localStorage.getItem(FEEDBACK_STORAGE_KEY) retrieves the feedback stored under the key "salt-customer-feedback"
        //|| "[]" means that if nothing is stored (null), we use an empty array instead.
        //JSON.parse() converts the retrieved JSON string into a JavaScript value, such as an array of feedback objects.

        return Array.isArray(savedFeedback)
            ? savedFeedback
            : []; //Here, we use Array.isArray() to check whether savedFeedback is actually an array. If savedFeedback is an array, return it. Otherwise, return an empty array [].
    } catch {
        return [];
    }
};

export const Feedback = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        comment: ""
    });

    const [message, setMessage] = useState("");
    const [feedback, setFeedback] = useState(getFeedback);

    //This function is to update the form fields whenever the user types something.
    const updateField = (event) => {  //event represents the event triggered when the user changes an input field.
        const { name, value } = event.target; //Here, we use object destructuring to extract two properties from event.target
        //event.target refers to the input field that the user changed.
        //name identifies which field was changed.
        //value contains the text entered by the user.

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }));
        /* setFormData() to update the state. The spread operator preserves the existing form values,
         while [name]: value updates only the field that the user modified. 
        This allows me to handle multiple form fields using one function instead of creating a separate function for each input. */
    };

    //It takes the information entered by the customer, validates it, creates a new feedback object, 
    // saves it in localStorage, updates the displayed feedback, clears the form, and displays a success message.
    const handleSubmit = (event) => {
        event.preventDefault();

        const name = formData.name.trim();
        const comment = formData.comment.trim(); //we extract the name and comment from the formData state. trim() method removes unnecessary spaces from the beginning and end of the text.

        if (!name || !comment) {
            setMessage(
                "Please add your name and feedback before submitting."
            );
            return; //if name or comment missing add an error and exit
        }

        const newFeedback = {
            id: `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,
            name,
            comment,
            submittedAt: new Date().toISOString()
        }; //Here, we create an object containing all the information about the new feedback. it has an id , name , comment and the time

        const updatedFeedback = [
            newFeedback,
            ...getFeedback()
        ]; //we add the new feedback to the list

        localStorage.setItem(
            FEEDBACK_STORAGE_KEY,
            JSON.stringify(updatedFeedback)
        ); // we set the updated list in the local strorage

        setFeedback(updatedFeedback);

        setFormData({
            name: "",
            comment: ""
        });

        setMessage(
            "Thank you! your feedback has been sent."
        );
    };

    return (
        <div className="min-h-[70vh] bg-[#fffdf8] px-6 py-12 sm:px-10">

            <button
                type="button"
                onClick={() => navigate("/")}
                className="mb-10 inline-flex items-center gap-2 rounded-full border border-[#073f7020] bg-[#fffdf8] px-5 py-2.5 text-sm font-medium text-[#073f70] transition hover:bg-[#f0ede4]"
            >
                <ArrowLeft size={17} />
                Back to Menu
            </button>

            <div className="mx-auto max-w-xl rounded-2xl border border-[#073f7020] bg-white p-8 shadow-[0_8px_20px_rgb(7_63_112_/_8%)]">

                <div className="text-center">
                    <Heart
                        size={34}
                        className="mx-auto text-[#074d86]"
                    />

                    <h1 className="mt-4 text-3xl font-bold text-[#074d86]">
                        Feedback
                    </h1>

                    <p className="mt-2 text-sm leading-relaxed text-[#4780a0]">
                        We would love to hear about your experience with SALT.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5"
                >
                    <label className="block text-sm font-semibold text-[#30678d]">
                        Your name

                        <input
                            name="name"
                            value={formData.name}
                            onChange={updateField}
                            className="mt-2 w-full rounded-lg border border-[#073f7020] px-4 py-3 font-normal outline-none transition focus:border-[#073f70] focus:ring-2 focus:ring-[#073f70]/10"
                            placeholder="Name"
                        />
                    </label>

                    <label className="block text-sm font-semibold text-[#30678d]">
                        Your feedback

                        <textarea
                            name="comment"
                            value={formData.comment}
                            onChange={updateField}
                            rows="5"
                            className="mt-2 w-full resize-y rounded-lg border border-[#073f7020] px-4 py-3 font-normal outline-none transition focus:border-[#073f70] focus:ring-2 focus:ring-[#073f70]/10"
                            placeholder="Tell us what you enjoyed or what we can improve."
                        />
                    </label>

                    {/* here we display the message succeed of failed */}
                    {message && (
                        <p className="rounded-lg bg-[#e7f0ee] p-3 text-sm text-[#30678d]">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-[#073f70] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0a568f] active:scale-[0.98]"
                    >
                        Send feedback
                    </button>
                </form>

                <div className="mt-10 border-t border-[#073f7015] pt-7">

                    <h2 className="text-xl font-bold text-[#074d86]">
                        What our guests are saying
                    </h2>

                    {feedback.length === 0 ? (
                        <p className="mt-3 text-sm text-[#4780a0]">
                            Be the first to leave feedback.
                        </p>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {feedback.map((item) => (
                                <article
                                    key={item.id}
                                    className="rounded-xl bg-[#f8f6ef] p-4"
                                >
                                    <p className="font-semibold text-[#074d86]">
                                        {item.name}
                                    </p>

                                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-[#30678d]">
                                        {item.comment}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

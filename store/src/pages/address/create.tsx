import {
  IResourceComponentsProps,
  useNavigation,
  useSelect,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";
import CitySelect from "../../components/CitySelect";
import StateSelect from "../../components/StateSelect";
import CountrySelect from "../../components/CountrySelect";

export const AddressCreate: React.FC<IResourceComponentsProps> = () => {
  const { list } = useNavigation();

  const {
    refineCore: { onFinish },
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({});

  console.log("errors", errors);

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Create</h1>
        <div>
          <button
            onClick={() => {
              list("address");
            }}
          >
            List
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit(onFinish)}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <label>
            <span style={{ marginRight: "8px" }}>title</span>
            <input
              type="text"
              {...register("address_title", {
                required: "This field is required",
              })}
            />
            <span style={{ color: "red" }}>
              {(errors as any)?.title?.message as string}
            </span>
          </label>
          <label>
            <span style={{ marginRight: "8px" }}>Addrss Line 1</span>
            <textarea
              rows={1}
              cols={33}
              style={{ verticalAlign: "top" }}
              {...register("address_line1", {
                required: "This field is required",
              })}
            />
            <span style={{ color: "red" }}>
              {(errors as any)?.content?.message as string}
            </span>
          </label>
          <label>
            <span style={{ marginRight: "8px" }}>Addrss Line 2</span>
            <textarea
              rows={1}
              cols={33}
              style={{ verticalAlign: "top" }}
              {...register("address_line2", {})}
            />
            <span style={{ color: "red" }}>
              {(errors as any)?.content?.message as string}
            </span>
          </label>
          <label>
            <span style={{ marginRight: "8px" }}>City</span>
            <CitySelect
              name="city"
              onChange={({ value: city }) => setValue("city", city)}
              value={getValues("city")}
            />
            <span style={{ color: "red" }}>
              {(errors as any)?.category?.id?.message as string}
            </span>
          </label>
          <label>
            <span style={{ marginRight: "8px" }}>State</span>
            <StateSelect
              name="state"
              value={getValues("state")}
              onChange={({ value: state }) => setValue("state", state)}
            />
            <span style={{ color: "red" }}>
              {(errors as any)?.status?.message as string}
            </span>
          </label>
          <label>
            <span style={{ marginRight: "8px" }}>Country</span>
            <CountrySelect
              name="country"
              value={getValues("country")}
              onChange={({ value: country }) => setValue("country", country)}
            />
            <span style={{ color: "red" }}>
              {(errors as any)?.status?.message as string}
            </span>
          </label>
          <label>
            <span style={{ marginRight: "8px" }}>Pin Code</span>
            <input type="number" {...register("pincode", {})} />
            <span style={{ color: "red" }}>
              {(errors as any)?.status?.message as string}
            </span>
          </label>
          <label>
            <span style={{ marginRight: "8px" }}>Phone</span>
            <input
              type="number"
              {...register("phone", {
                required: "This field is required",
              })}
            />
            <span style={{ color: "red" }}>
              {(errors as any)?.status?.message as string}
            </span>
          </label>
          <label>
            <span style={{ marginRight: "8px" }}>Email</span>
            <input
              type="email_id"
              {...register("email", {
                required: "This field is required",
              })}
            />
            <span style={{ color: "red" }}>
              {(errors as any)?.status?.message as string}
            </span>
          </label>
          <label>
            <span style={{ marginRight: "8px" }}>Type</span>
            <select
              {...register("address_type", {
                required: "This field is required",
              })}
            >
              <option value="Billing">Billing</option>
              <option value="Shipping">Shipping</option>
            </select>
            <span style={{ color: "red" }}>
              {(errors as any)?.status?.message as string}
            </span>
          </label>
          <div>
            <input type="submit" value="save" />
          </div>
        </div>
      </form>
    </div>
  );
};

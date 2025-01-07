import { Fragment, memo } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { BsTrash3 } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";

type PropTypes = {
  name: string;
  errorMessage?: string;
};

const RHFTextFieldOptionList = memo(function RHFTextFieldOptionList({
  name,
  errorMessage,
}: PropTypes) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as "optionList",
  });

  return (
    <Fragment>
      <Box display="flex" flexDirection="column" gap={1}>
        {fields.map((field, index) => (
          <Controller
            key={field.id}
            name={`${name}.${index}`}
            control={control}
            render={({ field: { onChange, value }, fieldState }) => {
              const error: any = fieldState.error;

              return (
                <Box display="flex" flexDirection="column">
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={0.8}
                  >
                    <TextField
                      fullWidth
                      sx={{
                        "& input": {
                          padding: 1,
                        },
                      }}
                      error={!!error?.title || !!error?.message}
                      placeholder="گزینه جدید"
                      value={value.title}
                      onChange={(e) =>
                        onChange({ ...value, title: e.target.value })
                      }
                    />
                    <TextField
                      sx={{
                        width: "20%",
                        "& input": {
                          textAlign: "center",
                          padding: 1,
                        },
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                          {
                            display: "none",
                          },
                        "& input[type=number]": {
                          MozAppearance: "textfield",
                        },
                      }}
                      error={!!error?.score}
                      placeholder="0..99"
                      type="number"
                      value={value.score}
                      onChange={(e) => {
                        if (e.target.value === "") {
                          onChange({ ...value, score: "" });
                        } else {
                          onChange({ ...value, score: Number(e.target.value) });
                        }
                      }}
                    />
                    <IconButton
                      aria-label="trash"
                      onClick={() => remove(index)}
                      sx={{
                        marginBottom: 0,
                        borderRadius: "5px",
                        border: "1px solid transparent",
                        borderColor: "#FA4D56",
                        color: "#FA4D56",
                      }}
                    >
                      <BsTrash3
                        width={24}
                        height={24}
                        size="1.3rem"
                        color="#FA4D56"
                      />
                    </IconButton>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "red",
                      flex: "1 1",
                      mt: "3px",
                    }}
                  >
                    {error?.title?.message || error?.score?.message}
                  </Typography>
                </Box>
              );
            }}
          />
        ))}
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        flexDirection="column"
        gap={0.8}
        mt="7px"
      >
        {fields.length < 10 ? (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection="row"
            gap={0.8}
          >
            <TextField
              fullWidth
              sx={{
                "& input": {
                  padding: 1,
                },
              }}
              placeholder="گزینه جدید"
              disabled
            />
            <TextField
              sx={{
                width: "20%",
                "& input": {
                  textAlign: "center",
                  padding: 1,
                },
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
              }}
              placeholder="5"
              type="number"
              disabled
            />
            <IconButton
              aria-label="plus"
              onClick={() => {
                if (fields.length < 10) {
                  append({ title: "", score: fields.length + 1 });
                }
              }}
              sx={{
                marginBottom: 0,
                borderRadius: "5px",
                border: "1px solid transparent",
                borderColor: "#1758BA",
                color: "#1758BA",
              }}
            >
              <FiPlus width={24} height={24} size="1.4rem" color="#1758BA" />
            </IconButton>
          </Box>
        ) : null}
        {errorMessage ? (
          <Typography
            sx={{
              fontSize: "12px",
              color: "red",
              flex: "1 1",
              marginRight: "5px",
              textAlign: "left",
            }}
          >
            {errorMessage}
          </Typography>
        ) : null}
      </Box>
    </Fragment>
  );
});

export default RHFTextFieldOptionList;

'use client';

import * as React from 'react';
import {
  useAutocomplete,
  AutocompleteGetTagProps
} from '@mui/base/useAutocomplete';
import { styled } from '@mui/material/styles';
import { TAccount, TUICustomizedCombo } from '.';
// import CheckIcon from '@mui/icons-material/Check';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { autocompleteClasses } from '@mui/material/Autocomplete';

const Root = styled('div')(
  ({ theme }) => `
  color: ${
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'
  };
  font-size: 14px;
`
);

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled('div')(
  ({ theme }) => `
  height : 50px;
  align-items: center;
  border: 1px solid ${theme.palette.mode === 'dark' ? '#434343' : '#CED4DA'};
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
  border-radius: 15px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
  }

  &.focused {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
    color: ${
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : '9FA9B2'
    };
    font-size: 12px;
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    border-radius: 15px;
    margin: 0;
    outline: 0;
  }
`
);

interface TagProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
  price: string | number;
}

function Tag(props: TagProps) {
  const { label, price, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <div className="flex flex-row">
        <span className="flex w-2/3 justify-end">{price} تومان</span>
        {/* <DeleteOutlineIcon onClick={onDelete} /> */}
      </div>
    </div>
  );
}

const StyledTag = styled(Tag)<TagProps>(
  ({ theme }) => `
  display: flex;
  font-size: 13px;
  align-items: center;
  height: 24px;
  margin: 12px 2px;
  line-height: 22px;
  color : "#404040";
  background-color: ${
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#CDF9F7'
  };
  border-radius: 15px;
  box-sizing: content-box;
  padding: 1rem 10px;
  outline: 0;
  overflow: hidden;
  justify-content: space-between;

  &:focus {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-right: 8px;
    width:100%
  }

  & svg {
    color: #B40000;
    font-size: 28px;
    cursor: pointer;
    padding: 4px;
  }
`
);

const Listbox = styled('ul')(
  // position: absolute;
  ({ theme }) => `
  margin: 2px 0 0;
  padding: 0;
  list-style: none;
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === 'dark' ? '#2b2b2b' : '#fafafa'};
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`
);

export default function UICustomizedCombo({
  placeholder,
  label,
  account,
  selectedCredits
}: TUICustomizedCombo) {
  console.log('account :>> ', account);
  const {
    getInputLabelProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    getInputProps,
    getRootProps,
    getTagProps,
    setAnchorEl,
    focused,
    value
  } = useAutocomplete({
    id: 'customized-hook-demo',
    // defaultValue: [account?.[1]],
    multiple: true,
    options: account!,
    getOptionLabel: (option) => option.creditType
  });

  React.useEffect(() => {
    selectedCredits(value[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <>
      <Root className="w-full">
        <div {...getRootProps()} className="w-full">
          {/* <Label
            className="text-ms-sm text-[#9FA9B2]"
            {...getInputLabelProps()}
          >
            {label}
          </Label> */}
          <InputWrapper
            ref={setAnchorEl}
            className={focused ? 'focused w-full' : 'w-full'}
          >
            <input placeholder={placeholder} {...getInputProps()} />
          </InputWrapper>
        </div>
        {groupedOptions.length > 0 ? (
          <Listbox {...getListboxProps()}>
            {(groupedOptions as typeof account).map((option, index) => (
              <li
                key={index}
                {...getOptionProps({ option, index })}
                className="flex justify-between w-full"
              >
                <span>{option.creditType}</span>
                <div>
                  <span>{option.availableAmount}</span>
                  {/* <CheckIcon fontSize="small" /> */}
                </div>
              </li>
            ))}
          </Listbox>
        ) : null}
      </Root>

      {/* {value.map((option: TAccount, index: number) => (
        <div key={index}>
          <StyledTag
            label={option.creditType}
            price={option.availableAmount}
            {...getTagProps({ index })}
          />
        </div>
      ))} */}
    </>
  );
}

// 'use client';

// import * as React from 'react';
// import {
//   useAutocomplete,
//   AutocompleteGetTagProps
// } from '@mui/base/useAutocomplete';
// import { styled } from '@mui/material/styles';
// import { TAccount, TUICustomizedCombo } from '.';
// // import CheckIcon from '@mui/icons-material/Check';
// // import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import { autocompleteClasses } from '@mui/material/Autocomplete';

// const Root = styled('div')(
//   ({ theme }) => `
//   color: ${
//     theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'
//   };
//   font-size: 14px;
// `
// );

// const Label = styled('label')`
//   padding: 0 0 4px;
//   line-height: 1.5;
//   display: block;
// `;

// const InputWrapper = styled('div')(
//   ({ theme }) => `
//   height : 50px;
//   align-items: center;
//   border: 1px solid ${theme.palette.mode === 'dark' ? '#434343' : '#CED4DA'};
//   background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
//   border-radius: 15px;
//   padding: 1px;
//   display: flex;
//   flex-wrap: wrap;

//   &:hover {
//     border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
//   }

//   &.focused {
//     border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
//     box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
//   }

//   & input {
//     background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
//     color: ${
//       theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : '9FA9B2'
//     };
//     font-size: 12px;
//     height: 30px;
//     box-sizing: border-box;
//     padding: 4px 6px;
//     width: 0;
//     min-width: 30px;
//     flex-grow: 1;
//     border: 0;
//     border-radius: 15px;
//     margin: 0;
//     outline: 0;
//   }
// `
// );

// interface TagProps extends ReturnType<AutocompleteGetTagProps> {
//   label: string;
//   price: string | number;
// }

// function Tag(props: TagProps) {
//   const { label, price, onDelete, ...other } = props;
//   return (
//     <div {...other}>
//       <span>{label}</span>
//       <div className="flex flex-row">
//         <span className="flex w-2/3 justify-end">{price} تومان</span>
//         {/* <DeleteOutlineIcon onClick={onDelete} /> */}
//       </div>
//     </div>
//   );
// }

// const StyledTag = styled(Tag)<TagProps>(
//   ({ theme }) => `
//   display: flex;
//   font-size: 13px;
//   align-items: center;
//   height: 24px;
//   margin: 12px 2px;
//   line-height: 22px;
//   color : "#404040";
//   background-color: ${
//     theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#CDF9F7'
//   };
//   border-radius: 15px;
//   box-sizing: content-box;
//   padding: 1rem 10px;
//   outline: 0;
//   overflow: hidden;
//   justify-content: space-between;

//   &:focus {
//     border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
//   }

//   & span {
//     overflow: hidden;
//     white-space: nowrap;
//     text-overflow: ellipsis;
//     padding-right: 8px;
//     width:100%
//   }

//   & svg {
//     color: #B40000;
//     font-size: 28px;
//     cursor: pointer;
//     padding: 4px;
//   }
// `
// );

// const Listbox = styled('ul')(
//   // position: absolute;
//   ({ theme }) => `
//   margin: 2px 0 0;
//   padding: 0;
//   list-style: none;
//   background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
//   overflow: auto;
//   max-height: 250px;
//   border-radius: 4px;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
//   z-index: 1;

//   & li {
//     padding: 5px 12px;
//     display: flex;

//     & span {
//       flex-grow: 1;
//     }

//     & svg {
//       color: transparent;
//     }
//   }

//   & li[aria-selected='true'] {
//     background-color: ${theme.palette.mode === 'dark' ? '#2b2b2b' : '#fafafa'};
//     font-weight: 600;

//     & svg {
//       color: #1890ff;
//     }
//   }

//   & li.${autocompleteClasses.focused} {
//     background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
//     cursor: pointer;

//     & svg {
//       color: currentColor;
//     }
//   }
// `
// );

// export default function UICustomizedCombo({
//   placeholder,
//   label,
//   account,
//   selectedCredits
// }: TUICustomizedCombo) {
//   console.log('account :>> ', account);
//   const {
//     getInputLabelProps,
//     getListboxProps,
//     getOptionProps,
//     groupedOptions,
//     getInputProps,
//     getRootProps,
//     getTagProps,
//     setAnchorEl,
//     focused,
//     value
//   } = useAutocomplete({
//     id: 'customized-hook-demo',
//     // defaultValue: [account?.[1]],
//     multiple: true,
//     options: account!,
//     getOptionLabel: (option) => option.creditType
//   });

//   React.useEffect(() => {
//     selectedCredits(value);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [value]);

//   return (
//     <>
//       <Root className="w-full">
//         <div {...getRootProps()} className="w-full">
//           <Label
//             className="text-ms-sm text-[#9FA9B2]"
//             {...getInputLabelProps()}
//           >
//             {label}
//           </Label>
//           <InputWrapper
//             ref={setAnchorEl}
//             className={focused ? 'focused w-full' : 'w-full'}
//           >
//             <input placeholder={placeholder} {...getInputProps()} />
//           </InputWrapper>
//         </div>
//         {groupedOptions.length > 0 ? (
//           <Listbox {...getListboxProps()}>
//             {(groupedOptions as typeof account).map((option, index) => (
//               <li
//                 key={index}
//                 {...getOptionProps({ option, index })}
//                 className="flex justify-between w-full"
//               >
//                 <span>{option.creditType}</span>
//                 <div>
//                   <span>{option.availableAmount}</span>
//                   {/* <CheckIcon fontSize="small" /> */}
//                 </div>
//               </li>
//             ))}
//           </Listbox>
//         ) : null}
//       </Root>

//       {value.map((option: TAccount, index: number) => (
//         <div key={index}>
//           <StyledTag
//             label={option.creditType}
//             price={option.availableAmount}
//             {...getTagProps({ index })}
//           />
//         </div>
//       ))}
//     </>
//   );
// }

// // interface FilmOptionType {
// //   title: string;
// //   year: number;
// // }

// // Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
// // const top100Films = [
// //   { title: 'اعتبار اربعین تا اربعین - زیر طرح 1', year: 82000000 },
// //   { title: 'The Godfather', year: 1972 },
// //   { title: 'The Godfather: Part II', year: 1974 },
// //   { title: 'The Dark Knight', year: 2008 },
// //   { title: '12 Angry Men', year: 1957 },
// //   { title: "Schindler's List", year: 1993 },
// //   { title: 'Pulp Fiction', year: 1994 },
// //   {
// //     title: 'The Lord of the Rings: The Return of the King',
// //     year: 2003
// //   },
// //   { title: 'The Good, the Bad and the Ugly', year: 1966 },
// //   { title: 'Fight Club', year: 1999 },
// //   {
// //     title: 'The Lord of the Rings: The Fellowship of the Ring',
// //     year: 2001
// //   },
// //   {
// //     title: 'Star Wars: Episode V - The Empire Strikes Back',
// //     year: 1980
// //   },
// //   { title: 'Forrest Gump', year: 1994 },
// //   { title: 'Inception', year: 2010 },
// //   {
// //     title: 'The Lord of the Rings: The Two Towers',
// //     year: 2002
// //   },
// //   { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
// //   { title: 'Goodfellas', year: 1990 },
// //   { title: 'The Matrix', year: 1999 },
// //   { title: 'Seven Samurai', year: 1954 },
// //   {
// //     title: 'Star Wars: Episode IV - A New Hope',
// //     year: 1977
// //   },
// //   { title: 'City of God', year: 2002 },
// //   { title: 'Se7en', year: 1995 },
// //   { title: 'The Silence of the Lambs', year: 1991 },
// //   { title: "It's a Wonderful Life", year: 1946 },
// //   { title: 'Life Is Beautiful', year: 1997 },
// //   { title: 'The Usual Suspects', year: 1995 },
// //   { title: 'Léon: The Professional', year: 1994 },
// //   { title: 'Spirited Away', year: 2001 },
// //   { title: 'Saving Private Ryan', year: 1998 },
// //   { title: 'Once Upon a Time in the West', year: 1968 },
// //   { title: 'American History X', year: 1998 },
// //   { title: 'Interstellar', year: 2014 },
// //   { title: 'Casablanca', year: 1942 },
// //   { title: 'City Lights', year: 1931 },
// //   { title: 'Psycho', year: 1960 },
// //   { title: 'The Green Mile', year: 1999 },
// //   { title: 'The Intouchables', year: 2011 },
// //   { title: 'Modern Times', year: 1936 },
// //   { title: 'Raiders of the Lost Ark', year: 1981 },
// //   { title: 'Rear Window', year: 1954 },
// //   { title: 'The Pianist', year: 2002 },
// //   { title: 'The Departed', year: 2006 },
// //   { title: 'Terminator 2: Judgment Day', year: 1991 },
// //   { title: 'Back to the Future', year: 1985 },
// //   { title: 'Whiplash', year: 2014 },
// //   { title: 'Gladiator', year: 2000 },
// //   { title: 'Memento', year: 2000 },
// //   { title: 'The Prestige', year: 2006 },
// //   { title: 'The Lion King', year: 1994 },
// //   { title: 'Apocalypse Now', year: 1979 },
// //   { title: 'Alien', year: 1979 },
// //   { title: 'Sunset Boulevard', year: 1950 },
// //   {
// //     title:
// //       'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
// //     year: 1964
// //   },
// //   { title: 'The Great Dictator', year: 1940 },
// //   { title: 'Cinema Paradiso', year: 1988 },
// //   { title: 'The Lives of Others', year: 2006 },
// //   { title: 'Grave of the Fireflies', year: 1988 },
// //   { title: 'Paths of Glory', year: 1957 },
// //   { title: 'Django Unchained', year: 2012 },
// //   { title: 'The Shining', year: 1980 },
// //   { title: 'WALL·E', year: 2008 },
// //   { title: 'American Beauty', year: 1999 },
// //   { title: 'The Dark Knight Rises', year: 2012 },
// //   { title: 'Princess Mononoke', year: 1997 },
// //   { title: 'Aliens', year: 1986 },
// //   { title: 'Oldboy', year: 2003 },
// //   { title: 'Once Upon a Time in America', year: 1984 },
// //   { title: 'Witness for the Prosecution', year: 1957 },
// //   { title: 'Das Boot', year: 1981 },
// //   { title: 'Citizen Kane', year: 1941 },
// //   { title: 'North by Northwest', year: 1959 },
// //   { title: 'Vertigo', year: 1958 },
// //   {
// //     title: 'Star Wars: Episode VI - Return of the Jedi',
// //     year: 1983
// //   },
// //   { title: 'Reservoir Dogs', year: 1992 },
// //   { title: 'Braveheart', year: 1995 },
// //   { title: 'M', year: 1931 },
// //   { title: 'Requiem for a Dream', year: 2000 },
// //   { title: 'Amélie', year: 2001 },
// //   { title: 'A Clockwork Orange', year: 1971 },
// //   { title: 'Like Stars on Earth', year: 2007 },
// //   { title: 'Taxi Driver', year: 1976 },
// //   { title: 'Lawrence of Arabia', year: 1962 },
// //   { title: 'Double Indemnity', year: 1944 },
// //   {
// //     title: 'Eternal Sunshine of the Spotless Mind',
// //     year: 2004
// //   },
// //   { title: 'Amadeus', year: 1984 },
// //   { title: 'To Kill a Mockingbird', year: 1962 },
// //   { title: 'Toy Story 3', year: 2010 },
// //   { title: 'Logan', year: 2017 },
// //   { title: 'Full Metal Jacket', year: 1987 },
// //   { title: 'Dangal', year: 2016 },
// //   { title: 'The Sting', year: 1973 },
// //   { title: '2001: A Space Odyssey', year: 1968 },
// //   { title: "Singin' in the Rain", year: 1952 },
// //   { title: 'Toy Story', year: 1995 },
// //   { title: 'Bicycle Thieves', year: 1948 },
// //   { title: 'The Kid', year: 1921 },
// //   { title: 'Inglourious Basterds', year: 2009 },
// //   { title: 'Snatch', year: 2000 },
// //   { title: '3 Idiots', year: 2009 },
// //   { title: 'Monty Python and the Holy Grail', year: 1975 }
// // ];

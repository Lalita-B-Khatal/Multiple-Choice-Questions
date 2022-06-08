import { Card, Typography, makeStyles, Grid, RadioGroup, FormControlLabel, Radio, AppBar, IconButton, Toolbar, Button } from "@material-ui/core"
import { useState, useEffect, createContext } from "react";
import { QuetionsJson } from '../data/data'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Answers } from "./Answers";

const useStyles = makeStyles(() => ({
	questionText: {
		fontFamily: 'CorpoS Standard, CorpoS, sans-serif',
		fontWeight: "bold",
		fontSize: 15,
	},
	title: {
		textAlign: "center",
		padding: "15px 0px 15px 0px",
		fontFamily: 'CorpoS Standard, CorpoS, sans-serif',
		fontWeight: "bold",
	},
	contentWrap: {
		padding: "12px 3px 3px 20px"
	},
	cardStyle: {
		backgroundColor: "#f3f3f3"
	},
	header: {
		backgroundColor: "#f7f8fa"
	},
	footer: {
		display: "flex",
		alignItems: "end",
		backgroundColor: "#f7f8fa",
	},
	nextButton: {
		backgroundColor: "#d90000",
		"&:hover": {
			backgroundColor: "#d90000",
		}
	},
	gridContainer: {
		padding: "0px 0px 30px 0px"
	},
	submitButton: {
		display: "flex",
		alignItems: "center",
		backgroundColor: "#f7f8fa",
	}
}))

export const QuestionContext = createContext()

const getData = (startCount, endCount, data) => {
	let newList = [];
	if (endCount > startCount) {
		for (var i = startCount; i < endCount; i++) {
			let newObject = { ...data[i], idx: i };
			newList.push(newObject);
		}
		return newList;
	} else {
		for (var j = endCount; j < startCount; j--) {
			let newObject = { ...data[j], idx: j };
			newList.push(newObject);
		}
		return newList;
	}
}

export const Questions = () => {
	const [answerData, setValue] = useState(QuetionsJson.questions);
	const [startCount, setStartCount] = useState(0);
	const [endCount, setEndCount] = useState(1);
	const [updatedList, setUpdatedData] = useState([]);
	const [showAnswer, setFlag] = useState(false);

	const classes = useStyles();
	useEffect(() => {
		if (updatedList.length === 0) {
			let newData = getData(startCount, endCount, answerData);
			setUpdatedData(newData);
		}
	}, [updatedList.length, startCount, endCount, answerData])
	const handleChange = (event, idx) => {
		let data = [...answerData];
		data[idx].answer = event.target.value
		setValue(data)
	};

	const handleDateChange = (newValue, idx) => {
		let data = [...answerData];
		data[idx].answer = newValue.toString();
		setValue(data)
	};

	const handleCheckBox = (event, idx, key) => {
		let data = [...answerData];
		data[idx].questionoption[key].selected = event.target.checked
		setValue(data)
	};

	const nextHandler = () => {
		let newStartCount = startCount + 1;
		let newEndCount = endCount + 1;
		if (newEndCount <= answerData.length) {
			let newData = getData(newStartCount, newEndCount, answerData)
			setUpdatedData(newData);
			setStartCount(newStartCount);
			setEndCount(newEndCount);
		}
	}

	const handleBack = () => {
		let newStartCount = startCount - 1;
		let newEndCount = endCount - 1;
		if (newStartCount >= 0) {
			let newData = getData(newStartCount, newEndCount, answerData)
			setUpdatedData(newData);
			setStartCount(newStartCount);
			setEndCount(newEndCount);
		}
	}

	const submitHandler = () => {
		setFlag(true)
	}
	let ShowNext = endCount < answerData.length
	return (
		<QuestionContext.Provider value={answerData}>
			<Grid container style={{ flex: 1, justifyContent: "center", height: "100vh", alignItems: "center" }}>
				{!showAnswer ? <Grid item lg={10}>
					<Card className={classes.cardStyle}>
						<AppBar position="static" className={classes.header}>
							<Toolbar>
								<IconButton
									edge="start"
									aria-label="menu"
									onClick={handleBack}
									sx={{ mr: 1 }}
								>
									<ArrowBackIcon />
								</IconButton>
							</Toolbar>
						</AppBar>
						<Typography variant="h5" className={classes.title}>
							Multiple Choice Questions
						</Typography>
						{updatedList?.map((item) => (
							<div className={classes.gridContainer}>
								<Grid container spacing={5} justifyContent="center">
									<Grid item xs={9}>
										<Card>
											<div className={classes.contentWrap}>
												<Typography className={classes.questionText}>
													{item?.question}
												</Typography>
												{item?.questionoption?.map((options, key) => (
													<>
														{item?.questiontype === "Radio" ? <RadioGroup
															aria-labelledby="demo-controlled-radio-buttons-group"
															value={answerData?.[item?.idx]?.answer || "NA"}
															onChange={e => handleChange(e, item?.idx)}>
															<FormControlLabel value={options.optionvalue} control={<Radio />} label={options.optionvalue} />
														</RadioGroup> : ""}
														{item?.questiontype === "Date" ?
															<LocalizationProvider dateAdapter={AdapterDateFns} >
																<DateTimePicker
																	value={answerData?.[item?.idx]?.answer}
																	onChange={value => handleDateChange(value, item?.idx)}
																	renderInput={(params) => <TextField variant="standard" {...params} />}
																/> </LocalizationProvider> : ""}
														{item?.questiontype === "Textarea" ?
															<TextareaAutosize
																aria-label="minimum height"
																minRows={3}
																value={answerData?.[item?.idx]?.answer}
																onChange={e => handleChange(e, item?.idx)}
																style={{ width: 200 }}
															/> : ""}
														{item?.questiontype === "Checkbox" ?
															<FormGroup aria-label="position" row>
																<FormControlLabel
																	value={options.optionvalue}
																	control={<Checkbox
																		checked={answerData?.[item?.idx]?.questionoption?.[key]?.selected || false}
																		onChange={e => handleCheckBox(e, item?.idx, key)} />}
																	label={options.optionvalue}
																	labelPlacement="end"
																/>
															</FormGroup>
															: ""}
													</>
												))}
											</div>
										</Card>
									</Grid>
								</Grid>
							</div>
						))}
						<AppBar position="static" className={ShowNext ? classes.footer : classes.submitButton}>
							<Toolbar>
								{ShowNext ?
									<Button className={classes.nextButton} variant="contained" onClick={nextHandler}>
										Next
									</Button> :
									<Button className={classes.nextButton} variant="contained" onClick={submitHandler}>
										Submit
									</Button>}
							</Toolbar>
						</AppBar>
					</Card>
				</Grid> : <Answers answerData={answerData} />}
			</Grid>
		</QuestionContext.Provider>
	)
}
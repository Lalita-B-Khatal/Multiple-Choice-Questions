import { Card, Grid, makeStyles, Typography } from "@material-ui/core"
import { useContext } from "react";
import { QuestionContext } from "./Questions";

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
    cardStyle: {
        backgroundColor: "#f3f3f3",
        height: "500px",
        overflowY: "auto",

    },
    answerCard: {
        padding: "20px 0px 20px 12px"
    },
    containerGrid: {
        paddingBottom: "20px"
    }
}))

export const Answers = () => {
    const classes = useStyles();
    const answerData = useContext(QuestionContext);
    console.log(answerData, "answerData")
    return (
        <Grid item xs={10}>
            <Card className={classes.cardStyle}>
                <Typography variant="h5" className={classes.title}>
                    Answers
                </Typography>
                {answerData.map((item) => (
                    <Grid container spacing={1} justifyContent="center" className={classes.containerGrid}>
                        <Grid item xs={7}>
                            <Card className={classes.answerCard}>
                                <Typography className={classes.questionText}>
                                    {item?.question}
                                </Typography>
                                <Typography>
                                    <b>Ans. </b>{item?.questiontype === "Checkbox" ? <>
                                        {item?.questionoption?.map((option) => (
                                            option?.selected ? option?.optionvalue + " " : ""
                                        ))}
                                    </> : item?.answer || "Not Answered"}
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>
                ))}
            </Card>
        </Grid>
    )
}
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { FullDialogBar, FullDialogGrid } from './customProfileStyle'
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import styles from './Profile.module.css';
import { AddTextField } from './customProfileStyle'
import { styled } from '@mui/material/styles';
import { Button, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { useDispatch } from 'react-redux';
import { requestChildrenStatus, requestAddChildReward, requestGetChildReward } from '../../app/actions/userActions'
import RewardList from './RewardList'
// import rabbit from '../../images/characters/rabbit.png'

const BorderLinearProgress = styled(LinearProgress)(_ => ({
  height: 20,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#eeeeee'
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#FAA085'
  },
}));

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}


function Profile({profile}){
  const dispatch = useDispatch()
  const [showReward, setShowReward] = useState(false)
  const [reward, setReward] = useState('')
  const [rewards, setRewards] = useState(null)

  useEffect(()=>{
    // console.log(profile)
    dispatch(requestGetChildReward(profile.sid))
      .then(res=>{
        // console.log(res)
        setRewards(res.payload.data.result.result)
      })

  }, [profile])

  const registReward = (e) => {
    const param = {
      title : reward,
      detail: "",
      pid: localStorage.getItem('main-user'),
      child: profile.sid
    }
    dispatch(requestAddChildReward(param))
      .then(res=>{
        // console.log(res)
        
        // add 하고 rewards를 갱신해줘야할듯 -> 바로바로 추가돼도 목록에 보이도록
        dispatch(requestGetChildReward(profile.sid))
        .then(res=>{
          // console.log(res)
          setRewards(res.payload.data.result.result)
        })
      })
    setShowReward(false)
    setReward('')
  }

  const onClickReward = (e) => {
    // console.log(profile)
    setShowReward(prev=>!prev)
  }

  const onRewardChange = (e) => {
    setReward(e.target.value)
  }

  return(
    <Grid 
      container direction="row" 
      justifyContent="center"
      alignItems="center"
      mt={'10%'}
    >
      <Grid item md={2} alignItems="end">
        <div>
          <div className={styles.player_static}>
            <img src={profile.img} width='100px'/>
          </div>
          <Typography sx={{ textAlign: 'center'}}>
            {profile.name}
          </Typography>
        </div>
      </Grid>
      <Grid item md={6}>
          <div>
            <Typography sx={{fontSize: '30px', textAlign:"center"}}>소모한 칼로리 {profile.kcal}kcal</Typography>
          </div>
          <Grid item>
            <div className={styles.progressbar__container}>
              <Typography sx={{width: '40px', zIndex: 40, fontSize: '30px', color: '#000', gridArea: '1/2/2/3', ml: '-20px'}}>
                1
              </Typography>
              <Typography sx={{width: '40px', zIndex: 40, fontSize: '30px', color: '#000', gridArea: '1/6/2/7', ml: '-20px'}}>
                1
              </Typography>
              <StarRoundedIcon sx={{fontSize: '100px', color: '#F5EAB3', zIndex: 30, gridArea: '1/2/2/3', ml: '-50px'}} />
              <StarRoundedIcon sx={{fontSize: '100px', color: '#E8C517', zIndex: 30, gridArea: '1/6/2/7', ml: '-50px'}} />
              <BorderLinearProgress sx={{gridArea: '1/2/2/6', zIndex: 20}} variant="determinate" value={50} />
            </div>
        </Grid>

        {/* 보상 목록 리스트 */}
        <Grid item ml={'40px'}>
          <RewardList rewards={rewards} />
          <div style={{textAlign:'right', marginRight:'10%'}}>
            <Button onClick={onClickReward}>{profile.name}님에게 보상 추가하기</Button>          
          </div>          
        </Grid>

        {/* 보상 추가 시 텍스트필드 */}
        <Grid item ml={'40px'} style={{display: showReward?'block':'none'}} >
          <AddTextField  
            style={{width:'80%'}} 
            value={reward}
            onChange={onRewardChange}
          />
          <Button onClick={registReward}>추가</Button>
        </Grid>
      </Grid>
      <Grid item md={2} justifyContent="space-around">
        {/* <Typography sx={{fontSize: '30px'}}></Typography> */}
        <Typography sx={{fontSize: '30px'}}>레벨 2000</Typography>
      </Grid>
    </Grid>
  )
}

export function StatDialog(props) {
  const [progress, setProgress] = React.useState(0);
  const handleClose = () => {
    props.getClose()
  }

  const [profiles, setProfiles] = useState(null)
  
  const dispatch = useDispatch()
  useEffect(()=>{
    if(props.open){
      dispatch(requestChildrenStatus(localStorage.getItem('main-user')))
        .then(res=>{
          // console.log(res.payload.data.result.subusers)
          setProfiles(res.payload.data.result.subusers)
        })
    }
  },[props.open])

  return (
    <Dialog
      fullScreen
      open={props.open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <FullDialogBar sx={{ position: 'fixed' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Statistics
          </Typography>
        </Toolbar>
      </FullDialogBar>
      <FullDialogGrid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        id='statContainer'
        style={{height: 'auto'}}
      >        
        {profiles===null?'empty':profiles.map(profile => (<Profile key={profile.name} profile={profile}/>))}
      </FullDialogGrid>
    </Dialog>
  )
}
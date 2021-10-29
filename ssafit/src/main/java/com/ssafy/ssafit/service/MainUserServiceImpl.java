package com.ssafy.ssafit.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.ssafit.domain.GetCt;
import com.ssafy.ssafit.domain.MainUser;
import com.ssafy.ssafit.domain.SubUser;
import com.ssafy.ssafit.repository.GetCtRepository;
import com.ssafy.ssafit.repository.MainuserRepository;
import com.ssafy.ssafit.repository.SubUserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class MainUserServiceImpl implements MainUserService{
	
	private final MainuserRepository mainuserRepository;
	private final SubUserRepository subUserRepository;
	private final GetCtRepository getCtRepository;
	
	@Override
	@Transactional
	public void deleteMember(long id) {
		MainUser m = mainuserRepository.findById(id).orElse(null);
		List<SubUser> sub = subUserRepository.findByMainUser(m).orElse(null);
		for(SubUser sb : sub) {
			GetCt gc = sb.getCid();
			sb.setCid(null);
			getCtRepository.delete(gc);
			subUserRepository.deleteById(sb.getSid());
		}
		mainuserRepository.deleteById(id);
	}
	
	@Override
	public boolean existId(String id) {
		MainUser m =mainuserRepository.findByUserId(id).orElse(null);
		
		if(m==null) {
			return true;
		}
		return false;
	}

}

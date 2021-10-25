package com.ssafy.ssafit.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.validation.ConstraintViolationException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ssafit.domain.ApiResMessage;
import com.ssafy.ssafit.domain.MainUser;
import com.ssafy.ssafit.repository.MainuserRepository;
import com.ssafy.ssafit.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping
@RequiredArgsConstructor
@CrossOrigin(origins = "*" )
public class UserController {
	
	private final PasswordEncoder passwordEncoder;	
	private final JwtTokenProvider jwtTokenProvider;
	private final MainuserRepository userRepository;
	
	@PostMapping("/join")
	public ResponseEntity<ApiResMessage> join(@RequestBody Map<String, String> user) {
//		Map<String,Object> ret = new HashMap<String, Object>();
		try {
			userRepository.save(MainUser.builder()
	                .userId(user.get("userid"))
					.email(user.get("email"))
	                .password(passwordEncoder.encode(user.get("password")))
	                .name(user.get("name"))
	                .phone(user.get("phone"))
	                .roles(Collections.singletonList("ROLE_USER")) // 최초 가입시 USER 로 설정
	                .build()).getId();
		} catch(ConstraintViolationException e) {
			
			return new ResponseEntity<ApiResMessage>(new ApiResMessage(500,null,"propertyNull"),HttpStatus.INTERNAL_SERVER_ERROR);
		}catch (DataIntegrityViolationException e) {
			return new ResponseEntity<ApiResMessage>(new ApiResMessage(500,null,"existId"),HttpStatus.INTERNAL_SERVER_ERROR);
		} 
		return new ResponseEntity<ApiResMessage>(new ApiResMessage(200,null,"회원가입이 완료되었습니다."),HttpStatus.OK);
		
		
	}
	
	 // 로그인
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> user) {
    	System.out.println("debug");
        MainUser member = userRepository.findByUserId(user.get("userid"))
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 E-MAIL 입니다."));
        if (!passwordEncoder.matches(user.get("password"), member.getPassword())) {
            throw new IllegalArgumentException("잘못된 비밀번호입니다.");
        }
        
        Map<String, Object> list = new HashMap<String, Object>();
        list.put("id", member.getId());
        list.put("userId", member.getId());
        list.put("email", member.getEmail());
        list.put("name", member.getName());
        list.put("phone", member.getPhone());
        list.put("token", jwtTokenProvider.createToken(member.getUsername(), member.getRoles()));
        return list;
    }
    
    @GetMapping("/user/ds")
    public String aa() {
    	return "check";
    }
    
	
}

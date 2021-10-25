package com.ssafy.ssafit.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.validation.ConstraintViolationException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
	public ResponseEntity<Map<String,Object>> join(@RequestBody Map<String, String> user) {
		Map<String,Object> ret = new HashMap<String, Object>();
		try {
			userRepository.save(MainUser.builder()
	                .userId(user.get("userid"))
					.email(user.get("email"))
	                .password(passwordEncoder.encode(user.get("password")))
	                .name(user.get("name"))
	                .phone(user.get("phone"))
	                .roles(Collections.singletonList("ROLE_USER")) // 理쒖큹 媛��엯�떆 USER 濡� �꽕�젙
	                .build()).getId();
		} catch(ConstraintViolationException e) {
			ret.put("detailError", "propertyNull");
			ret.put("result","속성 값에 null이 존재합니다.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ret);
		}catch (DataIntegrityViolationException e) {
			ret.put("detailError", "existId");
			ret.put("result","이미 있는 아이디 입니다.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ret);
		} 
		ret.put("result","�쉶�썝媛��엯�씠 �셿猷뚮릺�뿀�뒿�땲�떎.");
		return ResponseEntity.status(HttpStatus.OK).body(ret);
		
		
	}
	
	 // 濡쒓렇�씤
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> user) {
    	System.out.println("debug");
        MainUser member = userRepository.findByUserId(user.get("userid"))
                .orElseThrow(() -> new IllegalArgumentException("媛��엯�릺吏� �븡�� E-MAIL �엯�땲�떎."));
        if (!passwordEncoder.matches(user.get("password"), member.getPassword())) {
            throw new IllegalArgumentException("�옒紐삳맂 鍮꾨�踰덊샇�엯�땲�떎.");
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
    
    // 유저 정보 수정
    @PutMapping("/user")
    public Optional<MainUser> update(
    		@RequestParam Long id,
    		@RequestBody MainUser user){
    	System.out.println("update");
    	Optional<MainUser> updateUser = userRepository.findById(id);
    	
    	updateUser.ifPresent(selectUser -> {
    		selectUser.setName(user.getName());
    		selectUser.setPassword(user.getPassword());
    		selectUser.setPhone(user.getPhone());
    		selectUser.setEmail(user.getEmail());
    		
    		userRepository.save(selectUser);
    	});
    	return updateUser;
    }
	
}

package br.com.ideiasaleatorias.eleicaoonline.models;

import java.time.LocalDateTime;
import java.util.function.Supplier;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Entity
public class VoteTicket implements VoterIdentity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@NotBlank
	@Column(unique=true)
	private String userNumber;
	@NotNull
	private LocalDateTime instantCreation;
	
	
	public VoteTicket(Supplier<VoteTicketId> voteTicketIdGenerator) {
		this.userNumber = voteTicketIdGenerator.get().getId();
		this.instantCreation = LocalDateTime.now();			
	}

	public Vote vote(Candidate candidate) {
		return new Vote(this,candidate);
	}

	public String getUserNumber() {
		return userNumber;
	}
}

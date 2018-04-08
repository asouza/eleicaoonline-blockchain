package br.com.ideiasaleatorias.eleicaoonline.controllers.forms;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import br.com.ideiasaleatorias.eleicaoonline.daos.EllectionDao;
import br.com.ideiasaleatorias.eleicaoonline.models.Voter;

public class NewVoterForm {

	@NotBlank
	private String number;
	@NotNull
	private Integer ellectionId;

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	public Integer getEllectionId() {
		return ellectionId;
	}

	public void setEllectionId(Integer ellectionId) {
		this.ellectionId = ellectionId;
	}

	public Voter toVoter(EllectionDao ellectionDao) {
		return new Voter(number,ellectionDao.findById(ellectionId).get());
	}

}
